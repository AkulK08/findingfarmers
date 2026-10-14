# Publish Finding Farmers

The `github-pages/` folder is a complete static production site. Its live climate model calls Open-Meteo and NASA POWER directly from the visitor's browser, so it does not depend on localhost or a server-side API. The default GitHub Pages address is live now; attach a purchased domain through the Pages settings when one is available.

## One-time GitHub setup

1. Create an empty GitHub repository (for example, `findingfarmers-site`) and push this project to its `main` branch.
2. Open the repository’s **Settings → Pages** and select **GitHub Actions** as the publishing source. The included workflow will deploy `github-pages/` after every push to `main`.
3. In **Settings → Pages → Custom domain**, enter your purchased domain *before* changing DNS. GitHub will create the required `CNAME` file in the published site.
4. At the domain registrar, add these four **A** records for `@`:

   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

5. Add a **CNAME** record for `www` pointing to `YOUR-GITHUB-USERNAME.github.io` (not a repository path). Enable **Enforce HTTPS** after GitHub verifies the domain.
6. Add the TXT record GitHub displays when you verify the domain. This protects the domain from being claimed by another GitHub account.

DNS propagation can take up to 24 hours. Until then, the deployment is available at `https://YOUR-GITHUB-USERNAME.github.io/findingfarmers-site/`.

## What is deployed

- Hindi is the default UI language, with Bhojpuri and English controls.
- The climate engine uses the same transparent water-balance, three-point forecast range, crop-stage thresholds, humidity, soil moisture, and climate-normal workflow as the local app.
- Visitors can change district/crop/stage and download a JSON record of the live model run.
- The site includes no server keys, database credentials, analytics identifiers, or private farmer data.

## Content and asset credits

- Brand photograph: EqualStock IN, [Pexels photo 20344348](https://www.pexels.com/photo/farmers-in-india-20344348/), Pexels License.
- Field films: credits are linked on-page and recorded in `public/media/CREDITS.md`.

## Important operational boundary

This is decision support, not a substitute for a district agronomist or field inspection. Before sending recommendations to farmers at scale, validate against local observations, retain release records, and add a documented agronomist review process.
