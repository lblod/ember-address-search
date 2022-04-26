# @lblod/ember-address-search

This addon provides methods to get addresses from existing registries.

It works together with the backend service [adressenregister-fuzzy-search-service](https://github.com/lblod/adressenregister-fuzzy-search-service), to which it makes calls to suggest or find addresses.

## Installation

```
ember install @lblod/ember-address-search
```

## Usage

The addon can be used by importing the following service in your controller:
```
@service addressRegister;
```

### Methods

The service provides the following methods:
- `suggest(fuzzyString)`: does a fuzzy search based on a given string. Returns an `AddressSuggestion`.
- `findAll(suggestion)`: tries to find all the addresses matching a suggestion. Returns an array of `Address`.
- `toAddressSuggestion(address)`: turns an `Address` into an `AddressSuggetion`.

### Classes

The service manipulates two classes. 

**AddressSuggestion**
  ```
  const addressSuggestion = new AddressSuggestion({
    addressRegisterId,
    street,
    housenumber,
    busNumber,
    zipCode,
    municipality,
    fullAddress,
  });

  const isAddressSuggstionEmpty = addressSuggestion.isEmpty();
  ```

**Address**
```
const address = new Address({
  uri,
  addressRegisterId,
  street,
  housenumber,
  busNumber,
  zipCode,
  municipality,
  fullAddress,
});
```

## Roadmap

- Fix the continuous integration to push new versions to the npm registry. In the meantime, `npm publish` is our friend.
- If a decision is made to use the same display for address selection across the LBLOD applications, we could create a component using this service in [ember-appuniversum](https://github.com/appuniversum/ember-appuniversum).

## License

This project is licensed under the [MIT License](LICENSE.md).
