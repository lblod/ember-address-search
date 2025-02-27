import Service from '@ember/service';

export type SetupOptions = {
  endpoint: string;
};

export type Address = {
  uri?: string;
  addressRegisterId?: string;
  street?: string;
  housenumber: string;
  zipCode: string;
  municipality: string;
  country: string;
  fullAddress: string;
};

type ApiAddress = {
  ID: string;
  Thoroughfarename: string;
  Housenumber: string;
  Zipcode: string;
  Municipality: string;
  FormattedAddress: string;
  Country: string;
};

export default class AddressRegisterService extends Service {
  private endpoint: string = '';

  /**
   * Set the service up with required configuration
   *
   * @param {SetupOptions} options Options passed to setup the service :
   * - endpoint: the endpoint to which the calls will be made
   */
  setup(options: SetupOptions) {
    this.endpoint = options?.endpoint;
  }

  /**
   * Suggests addresses from a given string.
   * Via the API of loc.geopunt.be
   *
   * @param {string} fuzzyString The searched address, a fuzzy search will be performed
   * @returns {Array[Object]} The suggested addresses
   */
  async suggest(fuzzyString: string): Promise<Address[] | null> {
    if (this.endpoint) {
      const results: {
        adressen: ApiAddress[];
      } = await (
        await fetch(`${this.endpoint}/search?query=${fuzzyString}`)
      ).json();

      return results.adressen.map(function (address) {
        return {
          addressRegisterId: address.ID,
          street: address.Thoroughfarename,
          housenumber: address.Housenumber,
          zipCode: address.Zipcode,
          municipality: address.Municipality,
          fullAddress: address.FormattedAddress,
          country: address.Country,
        };
      });
    } else {
      console.warn('Please setup the endpoint before calling this method.');
      return null;
    }
  }

  /**
   * Finds the addresses matching the suggestion and get all its properties (including its URI)
   * Via the API of https://basisregisters.vlaanderen.be/api
   *
   * @param suggestion The suggested address
   * @returns The found addresses
   */
  async findAll(suggestion: Address): Promise<Address[] | null> {
    if (this.endpoint) {
      let addresses: Address[] = [];
      if (!this.isEmpty(suggestion)) {
        const results: ApiAddress[] = await (
          await fetch(
            `${this.endpoint}/match?municipality=${suggestion.municipality}&zipcode=${suggestion.zipCode}&thoroughfarename=${suggestion.street}&housenumber=${suggestion.housenumber}`,
          )
        ).json();

        addresses = results.map(function (result) {
          return {
            uri: result.identificator.id,
            addressRegisterId: result.identificator.objectId,
            fullAddress: result.volledigAdres.geografischeNaam.spelling,
            street: suggestion.street,
            housenumber: suggestion.housenumber,
            busNumber: result.busnummer ? result.busnummer : null,
            zipCode: suggestion.zipCode,
            municipality: suggestion.municipality,
            country: result.land ? result.land : null,
          };
        });
      }
      return addresses;
    } else {
      console.warn('Please setup the endpoint before calling this method.');
      return null;
    }
  }

  /**
   * Evaluates if an address is empty or not
   *
   * @param {Address} address The address to evaluate
   * @returns {boolean}
   */
  isEmpty(address: Address) {
    if (address) {
      return (
        !address.uri &&
        !address.addressRegisterId &&
        !address.street &&
        !address.housenumber &&
        !address.zipCode &&
        !address.municipality &&
        !address.country &&
        !address.fullAddress
      );
    } else {
      return true;
    }
  }
}
