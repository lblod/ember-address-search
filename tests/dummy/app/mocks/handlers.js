import { rest } from 'msw';

export const handlers = [
  rest.get('/test-endpoint/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('query');

    const data = [
      {
        id: 1,
        street: 'street',
        housenumber: 11,
        zipCode: 1000,
        municipality: 'municipality',
        fullAddress: 'street 11, 1000 municipality',
      },
      {
        id: 2,
        street: 'street',
        housenumber: 22,
        zipCode: 2000,
        municipality: 'municipality',
        fullAddress: 'street 22, 2000 municipality',
      },
      {
        id: 3,
        street: 'street',
        housenumber: 33,
        zipCode: 3000,
        municipality: 'municipality',
        fullAddress: 'street 33, 3000 municipality',
      },
    ];

    if (query === 'unvalid address') {
      return res(ctx.status(200), ctx.json({ adressen: [], totaalAantal: 0 }));
    } else {
      return res(
        ctx.status(200),
        ctx.json({ adressen: data, totaalAantal: 3 })
      );
    }
  }),

  rest.get('/test-endpoint/match', (req, res, ctx) => {
    const data = [
      {
        identificator: {
          id: 'https://data.vlaanderen.be/id/adres/437467',
          naamruimte: 'https://data.vlaanderen.be/id/adres',
          objectId: '437467',
          versieId: '2015-03-02T15:08:20+01:00',
        },
        detail: 'https://api.basisregisters.vlaanderen.be/v1/adressen/437467',
        huisnummer: '10',
        volledigAdres: {
          geografischeNaam: {
            spelling: 'Reaalstraat 10, 9400 Ninove',
            taal: 'nl',
          },
        },
        adresStatus: 'inGebruik',
      },
    ];

    return res(ctx.status(200), ctx.json(data));
  }),
];
