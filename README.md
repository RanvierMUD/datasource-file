YAML and JSON DataSources for the Ranvier game engine

### DataSources

* **YamlDataSource**: For use with all entities stored in one .yml file
  * Base Config: none
  * Entity Config: `{ path: string: path to .yml file from project root }`
* **YamlDirectoryDataSource**: For use with a directory containing a .yml file for each entity
  * Base Config: none
  * Config: `{ path: string: path to directory containing .yml files from project root }`
* **YamlAreaDataSource**: For use with areas stored in yml (with a manifest.yml file)
  * Base Config: none
  * Config: `{ path: string: path to directory containing area folders }`
* **JsonDataSource**: For use with all entities stored in one .json file
  * Base Config: none
  * Entity Config: `{ path: string: path to .json file from project root }`
* **JsonDirectoryDataSource**: For use with a directory containing a .json file for each entity
  * Base Config: none
  * Entity Config: `{ path: string: path to .yml file from project root }`
  * Config: `{ path: string: absolute path to directory containing .json files}`

#### Registration in ranvier.json

```js
{
  // ...
  "dataSources": {
    "Yaml": { "require": "ranvier-datasource-file.YamlDataSource" },
    "YamlArea": { "require": "ranvier-datasource-file.YamlAreaDataSource" },
    "YamlDirectory": { "require": "ranvier-datasource-file.YamlDirectoryDataSource" },
    "Json": { "require": "ranvier-datasource-file.JsonDataSource" },
    "JsonDirectory": { "require": "ranvier-datasource-file.JsonDirectoryDataSource" },
  },

  "entitySources": {
    "areas": {
      "source": "YamlArea",
      "config": {
        /* the [BUNDLE] and [AREA] tokens will be replaced with the value passed to
        entityLoader.setBundle and setArea respectively */
        "path": "bundles/[BUNDLE]/areas"
      }
    },
    "items": {
      "source": "Yaml",
      "config": {
        "path": "bundles/[BUNDLE]/areas/[AREA]/items.yml"
      }
    },

    "accounts": {
      "source": "JsonDirectory",
      "config": {
        "path": "data/accounts"
      }
    }
  }
}
```
