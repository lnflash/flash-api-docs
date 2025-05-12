const { introspectionQuery, buildClientSchema, printSchema } = require('graphql');
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchSchema() {
  try {
    const response = await fetch('https://api.flashapp.me/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data } = await response.json();
    const schema = buildClientSchema(data);
    const sdl = printSchema(schema);
    
    fs.writeFileSync('schema.graphql', sdl);
    console.log('Schema successfully fetched and saved to schema.graphql');
  } catch (error) {
    console.error('Error fetching schema:', error);
  }
}

fetchSchema();