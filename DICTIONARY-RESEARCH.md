# Bihar regional dictionary: editorial release 1.2

Researched 2026-11-02. Published dataset: `github-pages/dictionary-data.js`.

## Scope

350 distinct documentary headwords, not a field survey: 2 water-management records with district documentation, 316 historical records, and 32 published Bhojpuri vocabulary records. The collection now includes food, clothing, houses, household objects, agriculture, soil, weather, and livestock. Historical locations deliberately preserve the 1885 geography. Do not map historic Tirhut, Shahabad, Champaran, South Munger, or South Bhagalpur directly onto a modern district. Historical Gaya, Patna, and Saran are also labeled by date.

The historic source uses the broad category “Bihari”; this release does not infer a specific modern language label for each word. Bhojpuri lexicon entries without a district remain unassigned. No claim of first-ever dictionary, exclusivity, native-speaker verification, present-day frequency, or proprietary ownership of the source vocabulary is made.

## Sources and extraction

- G. A. Grierson, *Bihar Peasant Life* (1885), Bengal Secretariat Press, Cornell scan: https://archive.org/details/cu31924072688025 . Public-domain historical source. Consulted full text: https://archive.org/stream/cu31924072688025/cu31924072688025_djvu.txt . Initial sections 1, 5, 7, 11, 12, 16, 824, 953, 954, 955; expanded domestic vocabulary from §§603–745 and §§1234–1272. Each entry cites its own specific section. Definitions represent only the cited sense, not every possible sense of the word. The UI retains source romanizations in normalized typography and editorial Devanagari renderings; neither is a recording of present-day speech. Definitions are short new paraphrases, not a bulk reproduction of the dictionary.
- Central Ground Water Board, Gaya district aquifer report, printed page 13: https://www.cgwb.gov.in/old_website/AQM/NAQUIM_REPORT/Bihar/Gaya%20Final.pdf . Describes ahar and pyne in the district. Publication date not inferred from search crawl date.
- Bihar Minor Water Resources Department: https://betastate.bihar.gov.in/mwrd/DyPageView?PageTitleID=10120 . Documents the regional ahar-pyne system. The body includes historical planning material; the site's footer update date is not treated as the publication date.
- Jogira, Bhojpuri dictionary: https://jogira.com/bhojpuri-hindi-dictionary-and-translation/ . 32 selected headwords, including इनार, ऊसर/उसर, ओद, कांदो, कुदारी, कोल्हुआड़, खुखुड़ी, केरा, चास, गोयड़ा, गतान, गड़ासी, पगहा and पतई. No district asserted by this source. Roman forms and concise English glosses added editorially for search.

## Field collection workflow

The contribution form exports a JSON draft on the visitor's device. It does not send data to the site owner or write into the public dataset. Before accepting future submissions, obtain contributor consent, identify district/block/village, separate direct observation from reported usage, attach attributable evidence, and review the meaning with a local speaker. Keep any personal contact information outside the published dataset. A hosted intake/moderation service would be a separate implementation.

## Editorial presentation

Headwords are alphabetized with Hindi collation and browsable by their first Devanagari character. Entries display grammatical class, a numbered definition, subject, documented geographic scope, and numbered source references. The visible English gloss was removed; retained legacy English strings are search aliases/export metadata only. Word classes and Devanagari/roman spellings are editorial normalizations, not IPA or audio evidence. Accession identifiers follow the append-only dataset order.

## Checks performed for release 1.0 (24 entries)

Browser checked Roman search (`langal`), Devanagari search (`पइन`), Saran historical filter, empty results, clearing filters, and loading a word permalink. Exported and parsed both the 24-entry dataset and a clearly marked test contribution draft. Verified entry IDs, related-word references, source/place references, absence of replacement glyphs, JavaScript syntax, and patch whitespace.

## Release 1.2 checks

350 unique headwords and IDs; valid place, source, and cross-reference keys; all records include word classes and stable accession identifiers. Browser checked new headword ठेकुआ, alphabetical क filter (33 entries), historical Saran filter (12 entries), no-match export disabled, word permalink, and 390px mobile layout without horizontal overflow.

Verified full browser download contains 350 entries, version 1.2.0, word classes, accession identifiers, and source metadata.
