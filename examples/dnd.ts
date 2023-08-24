import f from "../mod.ts";

// One-shot
const { data } = await f("https://www.dnd5eapi.co/api/monsters/aboleth", {
  json: true,
}).get();
console.log("\n" + data.special_abilities[0].name);
console.log(data.special_abilities[0].desc);

// Get reusable references to subresources
const api = f("https://www.dnd5eapi.co/api", { json: true });
const monsters = api("monsters");
const dragonData = (await monsters("adult-black-dragon").get()).data;
console.log(
  "\nName:",
  dragonData.name,
  "\nAlignment:",
  dragonData.alignment + "\n",
);

// Get a blob from an image URL and write it to disk
const blobResponse = await api(dragonData.image).get({
  json: false,
  parseBody: false,
  headers: {
    "Accept": "image/png",
  },
});

if (blobResponse.body) {
  await Deno.writeFile("./dragon.png", blobResponse.body);
}
