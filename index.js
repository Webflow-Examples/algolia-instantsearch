window.addEventListener("DOMContentLoaded", () => {
  // establish connection to search index with application ID and public api key from algolia
  const searchClient = algoliasearch(
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

  // hide loader in Webflow after initiating algolia
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 2000);
});
