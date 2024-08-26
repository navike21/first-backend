#!/bin/bash

# Importar funciones de caseConversion.sh
source ./scripts/caseConversion.sh

# Importar funciones para crear controllers y router
source ./scripts/createControllers.sh
source ./scripts/createRouter.sh
source ./scripts/createSchema.sh
source ./scripts/createMiddleware.sh

# Solicitar el nombre del módulo en singular
read -p "📋 Enter the module name (singular): " singularName
singularNameCamel=$(toCamelCase "$singularName")
singularNamePascal=$(toPascalCase "$singularName")

# Validar que el nombre en singular no esté vacío o tenga caracteres extraños
if [[ -z "$singularNameCamel" || ! "$singularNameCamel" =~ ^[a-zA-Z]+$ ]]; then
  echo "❌ The singular name is required and must contain only letters."
  exit 1
fi

# Solicitar el nombre del módulo en plural
read -p "📋 Enter the module name (plural): " pluralName
pluralNameCamel=$(toCamelCase "$pluralName")
pluralNamePascal=$(toPascalCase "$pluralName")
pluralNameSnake=$(toSnakeCase "$pluralName")
pluralNameKebab=$(toKebabCase "$pluralName")
pluralNameScreamingSnake=$(toScreamingSnakeCase "$pluralName")

# Validar que el nombre en plural no esté vacío o tenga caracteres extraños
if [[ -z "$pluralNameCamel" || ! "$pluralNameCamel" =~ ^[a-zA-Z]+$ ]]; then
  echo "❌ The plural name is required and must contain only letters."
  exit 1
fi

modulePath="./src/modules/$pluralNameCamel"

if [ -d "$modulePath" ]; then
  echo "⚠️ The module '$pluralNameCamel' already exists in 'src/modules'."
else
  mkdir -p "$modulePath"
  echo "✅ Module created successfully: $pluralNameCamel at $modulePath"

  # Crear carpetas y archivos dentro del módulo
  for folder in "controllers" "language" "middlewares" "router" "schemas" "types"
  do
    mkdir -p "$modulePath/$folder"
    touch "$modulePath/$folder/index.ts"
    
    if [ "$folder" == "controllers" ]; then
      createControllers "$modulePath" "$singularNamePascal" "$pluralNamePascal" "$pluralNameScreamingSnake" "$pluralNameSnake"
    fi
    
    if [ "$folder" == "router" ]; then
      createRouter "$modulePath" "$singularNamePascal" "$pluralNamePascal" "$pluralNameCamel"
    fi

    if [ "$folder" == "schemas" ]; then
      createSchema "$modulePath" "${singularNameCamel}" "$singularNamePascal"
    fi

    if [ "$folder" == "middlewares" ]; then
      createMiddleware "$modulePath" "$singularNamePascal"
    fi
  done

  # Añadir el valor a modules.ts dentro del if
  modulesFile="./src/common/constants/modules.ts"
  if ! grep -q "const $pluralNameScreamingSnake" "$modulesFile"; then
    echo "export const $pluralNameScreamingSnake = '$pluralNameSnake'" >> "$modulesFile"
    echo "✅ Added constant $pluralNameScreamingSnake to $modulesFile"
  else
    echo "⚠️ Constant $pluralNameScreamingSnake already exists in $modulesFile"
  fi
fi
