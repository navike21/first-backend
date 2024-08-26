#!/bin/bash

# Función para crear los archivos de controladores
createControllers() {
  local modulePath="$1"
  local singularNamePascal="$2"
  local pluralNamePascal="$3"
  local pluralNameScreamingSnake="$4"
  local pluralNameSnake="$5"

  mkdir -p "$modulePath/controllers/crud"
  local crudFolder="$modulePath/controllers/crud"
  touch "$crudFolder/index.ts"
  local configFile="$modulePath/controllers/config.ts"
  touch "$configFile"

  echo "import { $pluralNameScreamingSnake } from '../../../common'" > "$configFile"
  echo "import { dataBase } from '../../../connection'" >> "$configFile"
  echo "" >> "$configFile"
  echo "const initializeDB = async () => {" >> "$configFile"
  echo "  const collection = dataBase.collection($pluralNameScreamingSnake)" >> "$configFile"
  echo "" >> "$configFile"
  echo "  await collection.createIndex({ public_id: 1 }, { unique: true })" >> "$configFile"
  echo "" >> "$configFile"
  echo "  return collection" >> "$configFile"
  echo "}" >> "$configFile"
  echo "" >> "$configFile"
  echo "export const ${singularNamePascal}Collection = initializeDB()" >> "$configFile"
  
  echo "Created file: $configFile with content."

  echo "export * from './create${singularNamePascal}'" > "$crudFolder/index.ts"
  echo "export * from './delete${singularNamePascal}'" >> "$crudFolder/index.ts"
  echo "export * from './list${pluralNamePascal}'" >> "$crudFolder/index.ts"
  echo "export * from './update${singularNamePascal}'" >> "$crudFolder/index.ts"
  echo "Created file: $crudFolder/index.ts with content."

  echo "export * from './crud'" > "$modulePath/controllers/index.ts"
  echo "Created file: $modulePath/controllers/index.ts with content."

  # Crear archivos de controladores en crud con contenido
  local createFile="$crudFolder/create${singularNamePascal}.ts"
  local deleteFile="$crudFolder/delete${singularNamePascal}.ts"
  local listFile="$crudFolder/list${pluralNamePascal}.ts"
  local updateFile="$crudFolder/update${singularNamePascal}.ts"

  echo "import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'" > "$createFile"
  echo "" >> "$createFile"
  echo "export const create${singularNamePascal} = async (" >> "$createFile"
  echo "  { body, headers }: TRequest," >> "$createFile"
  echo "  response: TResponse" >> "$createFile"
  echo ") => {" >> "$createFile"
  echo "  const { lang } = getInfoHeaders(headers)" >> "$createFile"
  echo "  const { data } = body as IRequest" >> "$createFile"
  echo "}" >> "$createFile"
  
  echo "Created file: $createFile with content."

  echo "import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'" > "$updateFile"
  echo "" >> "$updateFile"
  echo "export const update${singularNamePascal} = async (" >> "$updateFile"
  echo "  { body, headers, params }: TRequest," >> "$updateFile"
  echo "  response: TResponse" >> "$updateFile"
  echo ") => {" >> "$updateFile"
  echo "  const { lang } = getInfoHeaders(headers)" >> "$updateFile"
  echo "  const { id${singularNamePascal} } = params" >> "$updateFile"
  echo "  const { data } = body as IRequest" >> "$updateFile"
  echo "}" >> "$updateFile"
  
  echo "Created file: $updateFile with content."

  echo "import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'" > "$deleteFile"
  echo "" >> "$deleteFile"
  echo "export const delete${singularNamePascal} = async (" >> "$deleteFile"
  echo "  { body, headers, params }: TRequest," >> "$deleteFile"
  echo "  response: TResponse" >> "$deleteFile"
  echo ") => {" >> "$deleteFile"
  echo "  const { lang } = getInfoHeaders(headers)" >> "$deleteFile"
  echo "  const { id${singularNamePascal} } = params" >> "$deleteFile"
  echo "  const { data } = body as IRequest" >> "$deleteFile"
  echo "}" >> "$deleteFile"
  
  echo "Created file: $deleteFile with content."

  echo "import { getInfoHeaders, IRequest, TRequest, TResponse } from '../../../../common'" > "$listFile"
  echo "" >> "$listFile"
  echo "export const list${pluralNamePascal} = async (" >> "$listFile"
  echo "  { body, headers }: TRequest," >> "$listFile"
  echo "  response: TResponse" >> "$listFile"
  echo ") => {" >> "$listFile"
  echo "  const { lang } = getInfoHeaders(headers)" >> "$listFile"
  echo "  const {" >> "$listFile"
  echo "    meta: { page = 1, limit = 10 } = {}," >> "$listFile"
  echo "    filters = {}," >> "$listFile"
  echo "    sort = {}" >> "$listFile"
  echo "  } = body as IRequest" >> "$listFile"
  echo "" >> "$listFile"
  echo "  const skip = (page - 1) * limit" >> "$listFile"
  echo "}" >> "$listFile"
  
  echo "Created file: $listFile with content."
}

# Exportar la función para ser utilizada en otros scripts
export -f createControllers
