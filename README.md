# placewise-api-sdk-js
Official Javascript client for Placewise Media's REST API (v.12+).

Usage:

```javascript
var Client = require('./client.js');
var client = new Client('your.email@example.com', '<your password goes here>');

client.get('malls/123', { include: 'stores' }).then(function()
  console.log(client.repo.malls[0]);  // { id: '1066',
                                      //   type: 'malls',
                                      //   links: { self: 'https://api.placewise.com/malls/1066' },
                                      //   attributes:
                                      //   { name: 'City Shopping Center 10',
                                      //     sort_name: 'City Shopping Center 10',
                                      //     seo_slug: 'denver-co',
                                      //     nick_name: 'city10',
                                      //     address: '1390 Lawrence St. #300',
                                      //     city: 'Denver',
                                      //     state: 'CO'...

  console.log(client.repo.stores[0]); //  { id: '2128839873',
                                      //    type: 'stores',
                                      //    links: { self: 'https://api.placewise.com/stores/2128839873' },
                                      //    attributes:
                                      //     { name: 'Trendy & Co.',
                                      //       sort_name: 'Trendy & Co.',
                                      //       seo_slug: 'trendy-and-co'...
});

client.get('malls/123/deals').then(function) {
  console.log(client.repo.deals[0]);  //  { id: '2127993272',
                                      //    type: 'deals',
                                      //    links: { self: 'https://api.placewise.com/deals/2127993272' },
                                      //    attributes:
                                      //     { sales_type: 'Sales and Promos',
                                      //       title: 'Big Savings',
                                      //       seo_slug: 'big-savings',
                                      //       name: 'Trendy & Co.',
});
```
