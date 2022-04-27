import Service from '@ember/service';
import fetch from 'fetch';

export default class AddressRegisterService extends Service {
  /**
   * Set the service up with required configuration
   *
   * @param {Object} options Options passed to setup the service :
   * - endpoint: the endpoint to which the calls will be made
   */
  setup(options) {
    this.endpoint = options?.endpoint;
  }

  /**
   * Suggests addresses from a given string.
   * Via the API of loc.geopunt.be
   *
   * @param {string} fuzzyString The searched address, a fuzzy search will be performed
   * @returns {Array[Object]} The suggested addresses
   */
  async suggest(fuzzyString) {
    if (this.endpoint) {
      const results = await (
        await fetch(`${this.endpoint}/search?query=${fuzzyString}`)
      ).json();
      return results.adressen.map(function (result) {
        return {
          id: result.ID,
          street: result.Thoroughfarename,
          housenumber: result.Housenumber,
          zipCode: result.Zipcode,
          municipality: result.Municipality,
          fullAddress: result.FormattedAddress,
        };
      });
    } else {
      console.warn('Please setup the endpoint before calling this method.');
    }
  }

  /**
   * Finds the addresses matching the suggestion and get all its properties (including its URI)
   * Via the API of https://basisregisters.vlaanderen.be/api
   *
   * @param {Object} suggestion The suggested address
   * @returns {Array[Object]} The found addresses
   */
  async findAll(suggestion) {
    if (this.endpoint) {
      let addresses = [];
      if (!this.isEmpty(suggestion)) {
        const results = await (
          await fetch(
            `${this.endpoint}/match?municipality=${suggestion.municipality}&zipcode=${suggestion.zipCode}&thoroughfarename=${suggestion.street}&housenumber=${suggestion.housenumber}`
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
          };
        });
      }
      return addresses;
    } else {
      console.warn('Please setup the endpoint before calling this method.');
    }
  }

  /**
   * Evaluates if an address is empty or not
   *
   * @param {Object} address The address to evaluate
   * @returns {boolean}
   */
  isEmpty(address) {
    return (
      !address.uri &&
      !address.addressRegisterId &&
      !address.street &&
      !address.housenumber &&
      !address.zipCode &&
      !address.municipality &&
      !address.fullAddress
    );
  }
}
