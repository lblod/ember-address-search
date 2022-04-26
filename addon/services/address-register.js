import Service from '@ember/service';
import fetch from 'fetch';

export default class AddressRegisterService extends Service {
  /**
   * Suggests addresses from a given string.
   * Via the API of loc.geopunt.be
   *
   * @param {string} fuzzyString The searched address, a fuzzy search will be performed
   * @returns {AddressSuggestion}
   */
  async suggest(fuzzyString) {
    const results = await (
      await fetch(`/adresses-register/search?query=${fuzzyString}`)
    ).json();
    return results.adressen.map(function (result) {
      return new AddressSuggestion({
        id: result.ID,
        street: result.Thoroughfarename,
        housenumber: result.Housenumber,
        zipCode: result.Zipcode,
        municipality: result.Municipality,
        fullAddress: result.FormattedAddress,
      });
    });
  }

  /**
   * Finds the addresses matching the suggestion and get all its properties (including its URI)
   * Via the API of https://basisregisters.vlaanderen.be/api
   *
   * @param {AddressSuggestion} suggestion The suggested address
   * @returns {Array[Address]}
   */
  async findAll(suggestion) {
    let addresses = [];
    if (!suggestion.isEmpty()) {
      const results = await (
        await fetch(
          `/adresses-register/match?municipality=${suggestion.municipality}&zipcode=${suggestion.zipCode}&thoroughfarename=${suggestion.street}&housenumber=${suggestion.housenumber}`
        )
      ).json();
      addresses = results.map(function (result) {
        return new Address({
          uri: result.identificator.id,
          addressRegisterId: result.identificator.objectId,
          fullAddress: result.volledigAdres.geografischeNaam.spelling,
          street: suggestion.street,
          housenumber: suggestion.housenumber,
          busNumber: result.busnummer ? result.busnummer : null,
          zipCode: suggestion.zipCode,
          municipality: suggestion.municipality,
        });
      });
    }
    return addresses;
  }

  /**
   * Changes an address into an address suggestion
   *
   * @param {Address} address The address to transform into an addres suggestion
   * @returns {AddressSuggestion}
   */
  toAddressSuggestion(address) {
    return new AddressSuggestion({
      street: address.street,
      housenumber: address.number,
      busNumber: address.boxNumber,
      zipCode: address.postcode,
      municipality: address.municipality,
      fullAddress: address.fullAddress,
    });
  }
}

class AddressSuggestion {
  constructor({
    id,
    street,
    housenumber,
    busNumber,
    zipCode,
    municipality,
    fullAddress,
  }) {
    this.addressRegisterId = id;
    this.street = street;
    this.housenumber = housenumber;
    this.zipCode = zipCode;
    this.municipality = municipality;
    this.fullAddress = fullAddress;
    this.busNumber = busNumber;
  }

  isEmpty() {
    return (
      !this.addressRegisterId &&
      !this.street &&
      !this.housenumber &&
      !this.zipCode &&
      !this.municipality &&
      !this.fullAddress
    );
  }
}

class Address {
  constructor({
    addressRegisterId,
    uri,
    street,
    housenumber,
    busNumber,
    zipCode,
    municipality,
    fullAddress,
  }) {
    this.uri = uri;
    this.addressRegisterId = addressRegisterId;
    this.street = street;
    this.housenumber = housenumber;
    this.busNumber = busNumber;
    this.zipCode = zipCode;
    this.municipality = municipality;
    this.fullAddress = fullAddress;
  }
}
