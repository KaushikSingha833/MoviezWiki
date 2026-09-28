require("dotenv").config({path: ".env.local"});
if (!globalThis.fetch) {
    console.error("Fetch is not defined.");
    process.exit(1);
}

const { searchSemanticTMDB } = require("./src/lib/tmdb");

const titles = [
  'Hera Pheri',
  'Andaz Apna Apna',
  'Munna Bhai M.B.B.S.',
  '3 Idiots',
  'Welcome',
  'Golmaal: Fun Unlimited',
  'Dhamaal',
  'Delhi Belly',
  'Vicky Donor',
  'PK'
];

async function test() {
    console.log("Testing Semantic TMDB Search...");
    try {
        const sem = await searchSemanticTMDB(titles);
        console.log("Results Length:", sem?.results?.length);
        if (sem?.results?.length > 0) {
            console.log("First Result:", sem.results[0].title);
        } else {
            console.log("API returned 0 results. Data object:", sem);
        }
    } catch (e) {
        console.error("Semantic Search Error:", e);
    }
}

test();
