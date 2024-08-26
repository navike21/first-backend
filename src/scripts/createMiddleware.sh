#!/bin/bash

# Función para crear los archivos de middleware
createMiddleware() {
  local modulePath="$1"
  local singularNamePascal="$2"

  mkdir -p "$modulePath/middlewares"
  local middlewareFile="$modulePath/middlewares/validate${singularNamePascal}.ts"

  touch "$middlewareFile"

  cat <<EOF > "$middlewareFile"
import { ValidationError } from 'joi'
import {
  getInfoHeaders,
  handleErrors,
  IRequest,
  TNext,
  TRequest,
  TResponse
} from '../../../common'
import { ${singularNamePascal}Schema } from '../schemas'

export async function validate${singularNamePascal}(
  { body, headers }: TRequest,
  response: TResponse,
  next: TNext
) {
  try {
    const { lang } = getInfoHeaders(headers)
    const schema = ${singularNamePascal}Schema(lang)

    const { data } = body as IRequest

    await schema.validateAsync(data, {
      abortEarly: false
    })
    next()
  } catch (error) {
    const { details, message } = error as ValidationError
    handleErrors(
      {
        message,
        statusCode: 400,
        data: details
      },
      response
    )
  }
}
EOF

  echo "Created file: $middlewareFile with content."

  # Actualizar el archivo index.ts dentro de middlewares
  local indexFile="$modulePath/middlewares/index.ts"

  # Añadir la exportación del nuevo esquema
  echo "export * from './validate${singularNamePascal}'" >> "$indexFile"

  echo "Updated file: $indexFile with new export."
}

# Exportar la función para ser utilizada en otros scripts
export -f createMiddleware
