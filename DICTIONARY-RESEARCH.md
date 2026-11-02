# Agricultural dictionary: first editorial release

Researched 2026-11-02. Published dataset: `github-pages/dictionary-data.js`.

## Scope

24 documentary entries, not a field survey: 2 water-management records with district documentation, 14 historical records, and 8 published Bhojpuri vocabulary records. Historical locations deliberately preserve the 1885 geography. Do not map historic Tirhut, Shahabad, Champaran, South Munger, or South Bhagalpur directly onto a modern district. Historical Gaya, Patna, and Saran are also labeled by date.

The historic source uses the broad category “Bihari”; this release does not infer a specific modern language label for each word. Bhojpuri lexicon entries without a district remain unassigned. No claim of first-ever dictionary, exclusivity, native-speaker verification, present-day frequency, or proprietary ownership of the source vocabulary is made.

## Sources and extraction

- G. A. Grierson, *Bihar Peasant Life* (1885), Bengal Secretariat Press, Cornell scan: https://archive.org/details/cu31924072688025 . Public-domain historical source. Consulted full text: https://archive.org/stream/cu31924072688025/cu31924072688025_djvu.txt . Sections 1, 5, 7, 11, 12, 16, 824, 953, 954, 955. The UI retains source romanizations in normalized typography and editorial Devanagari renderings; neither is a recording of present-day speech. Definitions are short new paraphrases, not a bulk reproduction of the dictionary.
- Central Ground Water Board, Gaya district aquifer report, printed page 13: https://www.cgwb.gov.in/old_website/AQM/NAQUIM_REPORT/Bihar/Gaya%20Final.pdf . Describes ahar and pyne in the district. Publication date not inferred from search crawl date.
- Bihar Minor Water Resources Department: https://betastate.bihar.gov.in/mwrd/DyPageView?PageTitleID=10120 . Documents the regional ahar-pyne system. The body includes historical planning material; the site's footer update date is not treated as the publication date.
- Jogira, Bhojpuri dictionary: https://jogira.com/bhojpuri-hindi-dictionary-and-translation/ . Selected headwords: इनार, ऊसर/उसर, ओद, कांदो, कुदारी, कोल्हुआड़, खुखुड़ी, केरा. No district asserted by this source. Roman forms and concise English glosses added editorially for search.

## Field collection workflow

The contribution form exports a JSON draft on the visitor's device. It does not send data to the site owner or write into the public dataset. Before accepting future submissions, obtain contributor consent, identify district/block/village, separate direct observation from reported usage, attach attributable evidence, and review the meaning with a local speaker. Keep any personal contact information outside the published dataset. A hosted intake/moderation service would be a separate implementation.

## Checks performed

Browser checked Roman search (`langal`), Devanagari search (`पइन`), Saran historical filter, empty results, clearing filters, and loading a word permalink. Exported and parsed both the 24-entry dataset and a clearly marked test contribution draft. Verified entry IDs, related-word references, source/place references, absence of replacement glyphs, JavaScript syntax, and patch whitespace.
