#!/bin/bash

# Función para crear los archivos de esquema
createSchema() {
  local modulePath="$1"
  local singularNameCamel="$2"
  local singularNamePascal="$3"

  mkdir -p "$modulePath/schemas"
  local schemaFile="$modulePath/schemas/${singularNameCamel}.schema.ts"

  touch "$schemaFile"

  cat <<EOF > "$schemaFile"
import joi from 'joi'
import { DEFAULT_LANGUAGE, TLanguage } from '../../../common'

export const ${singularNamePascal}Schema = (lang: TLanguage = DEFAULT_LANGUAGE) => {
  return joi.object({})
}
EOF

  echo "Created file: $schemaFile with content."

  # Actualizar el archivo index.ts dentro de schemas
  local indexFile="$modulePath/schemas/index.ts"

  # Añadir la exportación del nuevo esquema
  echo "export * from './${singularNameCamel}.schema'" >> "$indexFile"

  echo "Updated file: $indexFile with new export."
}

# Exportar la función para ser utilizada en otros scripts
export -f createSchema
