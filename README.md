# Algolia Instantsearch with Webflow

Algolia Instantsearch allows us to build a UI that gives our users several options to filter our data.

- Demo site: https://Algolia-instantsearch.webflow.io/
- Algolia documentation: https://www.Algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/
- Algolia instantsearch showcase: https://www.Algolia.com/doc/guides/building-search-ui/widgets/showcase/js/

# How it works

We need to build the UI in Webflow and give the relevant HTML elements an id. In our Algolia set up script (see code below or `index.js` file), we declare the id for the widget and that adds it to the page. Some widgets require additional configuration in your index.

# Customizing Algolia Widgets

Every Algolia widget accepts optional parameters to add extra functionality. For example, the [hitsPerPage widget](https://www.algolia.com/doc/api-reference/widgets/hits-per-page/js/?client=With+a+CDN) explains the extra parameters it accepts.

<img src="https://wadoodh.github.io/images/hitsperpage-widget-example.png" alt="hitsperpage-widget-example">

# Style Algolia Widget

Every Algolia widget has a cssClasses property which allows you to write your own css and attach it to the widget. Here's an example of the hitsPerPage widget.

<img src="https://wadoodh.github.io/images/hitsperpage-cssclasses-example.png" alt="hitsperpage-cssclasses-example">

# Automating the process

We can automate data into Webflow by building backwards from Algolia. This workflow will automatically add data to Webflow and trigger the webhook to add data to our search index.
<img src="https://wadoodh.github.io/images/node-webhook-algolia-diagram.png" alt="node-webhook-Algolia-diagram">

1. Create Algolia index, get application ID, and both API keys (admin and search-only).
   <img src="https://wadoodh.github.io/images/algolia-api-keys.png" alt="Algolia-api-keys">

2. Create and add the `collection_item_created` webhook to Webflow with your endpoint. The endpoint should include code to make an api call to Algolia to add each item. See the [webhook examples repo](https://github.com/Webflow-Examples/webhook-examples).

**Note:** _We can also upload a JSON or CSV file to add data into Algolia. However, CSV files do not have an easy way to work with the required javascript array format for faceting in Algolia. This will impact how facets are created in Algolia._

3. Add Algolia scripts and build the UI in Webflow.

   <img src="https://wadoodh.github.io/images/webflow-custom-code-algolia.png" alt="webflow-custom-code-Algolia">
   <img src="https://wadoodh.github.io/images/webflow-ui.png" alt="webflow-ui">

4. Run the node js script. See the [populate data into Webflow cms](https://github.com/Webflow-Examples/populate-data-into-webflow-cms) example repo.

<img src="https://wadoodh.github.io/images/hitsperpage-cssclasses-example.png" alt="hitsperpage-cssclasses-example">

# The Javascript

```js
window.addEventListener("DOMContentLoaded", () => {
  // establish connection to search index with application ID and public api key from Algolia
  const searchClient = Algoliasearch(
    "6RJT8M6BD5",
    "113ff52e9d3bd9f965ce3ba85217a2c2"
  );

  const search = instantsearch({
    indexName: "movies",
    searchClient,
  });

  // add each widget
  search.addWidgets([
    // Clear Filters button
    instantsearch.widgets.clearRefinements({
      container: "#clear-refinements",
      templates: {
        resetLabel({ hasRefinements }, { html }) {
          return html`<span
            >${hasRefinements ? "Clear Filters" : "No Filters"}</span
          >`;
        },
      },
      cssClasses: {
        root: "wf-clear-refinement-root",
        button: "wf-clear-refinement-button",
        disabledButton: "wf-clear-refinement-disabled",
      },
    }),
    // Results per page dropdown
    instantsearch.widgets.hitsPerPage({
      container: "#hitsPerPage",
      items: [
        { label: "24 results", value: 24, default: true },
        { label: "36 results", value: 36 },
        { label: "48 results", value: 48 },
        { label: "72 results", value: 72 },
        { label: "96 results", value: 96 },
      ],
    }),
    // Genre component
    instantsearch.widgets.refinementList({
      container: "#genre-list",
      attribute: "genres",
      cssClasses: {
        checkbox: "wf-refinmentlist-checkbox",
        count: "wf-refinmentlist-count",
      },
    }),
    // Rating component
    instantsearch.widgets.ratingMenu({
      container: "#vote-average",
      attribute: "voteAverage",
      cssClasses: {
        item: "wf-rating-item",
        selectedItem: "wf-rating-selected-item",
        disabledItem: "wf-rating-disabled-item",
        starIcon: "wf-rating-star-icon",
        fullStarIcon: "wf-rating-fullstar-icon",
        emptyStarIcon: "wf-rating-empty-star-icon",
        count: "wf-rating-count",
      },
    }),
    // Year component (Range slider)
    instantsearch.widgets.rangeSlider({
      container: "#release-year",
      attribute: "releaseYear",
    }),
    // Votes component (Range slider)
    instantsearch.widgets.rangeSlider({
      container: "#vote-count",
      attribute: "voteCount",
    }),
    // Search component
    instantsearch.widgets.searchBox({
      container: document.querySelector("#searchbox"),
      cssClasses: {
        root: "wf-search-root",
        input: "wf-search-input",
        form: "wf-search-form",
        resetIcon: "wf-search-reset",
      },
    }),
    // Stats component
    instantsearch.widgets.stats({
      container: "#stats",
      templates: {
        text: `
          ⚡️ {{#areHitsSorted}}
          {{#hasNoSortedResults}}No relevant results{{/hasNoSortedResults}}
          {{#hasOneSortedResults}}1 relevant result{{/hasOneSortedResults}}
          {{#hasManySortedResults}}{{#helpers.formatNumber}}{{nbSortedHits}}{{/helpers.formatNumber}} relevant results{{/hasManySortedResults}}
          sorted out of {{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}
            {{/areHitsSorted}}
            {{^areHitsSorted}}
          {{#hasNoResults}}No results{{/hasNoResults}}
          {{#hasOneResult}}1 result{{/hasOneResult}}
          {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
        {{/areHitsSorted}}
        found in {{processingTimeMS}}ms
        `,
      },
    }),
    // Current filters component
    instantsearch.widgets.currentRefinements({
      container: "#current-filters",
      cssClasses: {
        list: "wf-current-refinement-list",
        label: "wf-label",
        item: "wf-current-refinement-item",
        category: "wf-current-refinement-category",
        delete: "wf-current-refinement-delete",
      },
    }),
    // Hits component
    instantsearch.widgets.hits({
      container: document.querySelector("#hits"),
      cssClasses: {
        root: "wf-hits",
        list: "wf-hits-list",
        item: "wf-hit-item",
        emptyRoot: "wf-hit-empty",
      },
      templates: {
        item: `
        <div class="hit-wrap">
            <a href="/movies/{{slug}}">
                <img class="hit-image" src="{{moviePoster}}" align="left" alt="{{name}}" />
            </a>            
        </div>   
        <span class="hit-vote-average">{{voteAverage}}</span>     
        `,
      },
    }),
    // Pagination component
    instantsearch.widgets.pagination({
      container: "#pagination",
      cssClasses: {
        root: "wf-pagination-root",
        list: "wf-pagination-list",
        selectedItem: "wf-pagination-selected-item",
        disabledItem: "wf-pagination-disabled",
        link: "wf-pagination-link",
      },
    }),
  ]);

  search.start();

  // hide loader in Webflow after initiating Algolia
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 2000);
});
```
