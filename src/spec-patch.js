// Script to patch the generated spec.html with our customizations
const fs = require('fs');
const path = require('path');

// Read the generated spec file
const specPath = path.join(__dirname, '..', 'public', 'spec.html');
let specContent = fs.readFileSync(specPath, 'utf8');

// No need to set data-theme attribute
specContent = specContent.replace(
  /<html class="no-js" lang="en">/,
  '<html class="no-js" lang="en">'
);

// Replace the logo
specContent = specContent.replace(
  /<div id="logo">\s*<img src="images\/logo\.png" title="Flash API Documentation" \/>\s*<\/div>/,
  '<div id="logo"><a href="index.html"><img src="images/logo-black.png" title="Flash API Documentation" /></a></div>'
);

// Add favicon
specContent = specContent.replace(
  /<link rel="icon" type="image\/png" href="images\/favicon\.ico" sizes="32x32">/,
  '<link rel="icon" href="favicon.ico" type="image/x-icon">'
);

// Add custom CSS
specContent = specContent.replace(
  /<link rel="stylesheet" href="stylesheets\/spectaql\.min\.css" \/>/,
  '<link rel="stylesheet" href="stylesheets/spectaql.min.css" />\n    <link rel="stylesheet" href="stylesheets/custom.css" />\n    <link rel="stylesheet" href="stylesheets/version-selector.css" />'
);

// Add back link and development notice
specContent = specContent.replace(
  /<body id="spectaql">/,
  `<body id="spectaql">
    <a href="index.html" class="back-link">← Back to Overview</a>
    <div class="notice">
      <strong>⚠️ Development Notice:</strong> The Flash API is currently under active development. All endpoints, parameters, and responses are subject to change and improvement. This documentation will be updated as the API evolves.
    </div>
    <style>
      .notice {
        background-color: #fff8e1;
        border-left: 4px solid #ffb300;
        padding: 16px;
        margin: 15px;
        border-radius: 4px;
        color: #5d4037;
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .notice strong {
        color: #d32f2f;
        font-weight: 600;
      }
    </style>`
);

// Add version manager scripts
specContent = specContent.replace(
  /<script src="javascripts\/spectaql\.min\.js"><\/script>/,
  '<script src="javascripts/spectaql.min.js"></script>\n    <script src="js/version-manager.js"></script>\n    <script src="js/version-router.js"></script>\n    <script src="js/version-comparison.js"></script>'
);

// Write the modified content back
fs.writeFileSync(specPath, specContent);

console.log('Spec file successfully patched with customizations');