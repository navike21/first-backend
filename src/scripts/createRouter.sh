#!/bin/bash

# Función para crear los archivos de router
createRouter() {
  local modulePath="$1"
  local singularNamePascal="$2"
  local pluralNamePascal="$3"
  local pluralNameCamel="$4"

  echo "export * from './${pluralNameCamel}Route';" > "$modulePath/router/index.ts"
  
  local routeFile="$modulePath/router/${pluralNameCamel}Route.ts"
  touch "$routeFile"
  
  echo "import { Router } from 'express'" > "$routeFile"
  echo "import {" >> "$routeFile"
  echo "  create${singularNamePascal}," >> "$routeFile"
  echo "  delete${singularNamePascal}," >> "$routeFile"
  echo "  list${pluralNamePascal}," >> "$routeFile"
  echo "  update${singularNamePascal}" >> "$routeFile"
  echo "} from '../controllers'" >> "$routeFile"
  echo "" >> "$routeFile"
  echo "const router = Router()" >> "$routeFile"
  echo "" >> "$routeFile"
  echo "router.post('/', create${singularNamePascal})" >> "$routeFile"
  echo "router.delete('/:id${singularNamePascal}', delete${singularNamePascal})" >> "$routeFile"
  echo "router.get('/', list${pluralNamePascal})" >> "$routeFile"
  echo "router.put('/:id${singularNamePascal}', update${singularNamePascal})" >> "$routeFile"
  echo "" >> "$routeFile"
  echo "export default router" >> "$routeFile"
  
  echo "Created file: $routeFile with content."
}

# Exportar la función para ser utilizada en otros scripts
export -f createRouter
