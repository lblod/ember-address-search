# @lblod/ember-address-search

This addon provides methods to get addresses from existing registries.

It works together with the backend service [adressenregister-fuzzy-search-service](https://github.com/lblod/adressenregister-fuzzy-search-service), to which it makes calls to suggest or find addresses.

## Compatibility

- Ember.js v4.12 or above
- Embroider or ember-auto-import v2

## Installation

```
npm install --save-dev @lblod/ember-address-search
```

## Usage

The addon can be used by importing the following service in your controller:
```
@service addressRegister;
```

### Methods

The addresses described below are objects with the following properties :
```
{
  uri, // only after `findAll`
  addressRegisterId,
  fullAddress,
  street,
  housenumber,
  busNumber,
  zipCode,
  municipality,
  country
}
```

The service provides the following methods:
- `suggest(fuzzyString)`: does a fuzzy search based on a given string. Returns an array of addresses.
- `findAll(suggestion)`: tries to find all the addresses matching a suggestion. Returns an array of addresses.
- `isEmpty(address)`: returns `true` if the address is empty, `false` otherwise.

## License

This project is licensed under the [MIT License](LICENSE.md).
