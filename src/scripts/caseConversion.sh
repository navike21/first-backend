#!/bin/bash

# Función para convertir texto a camelCase
toCamelCase() {
  echo "$1" | sed -e 's/[^a-zA-Z0-9 ]//g' \
  -e 's/[áÁàÀäÄâÂãÃåÅāĀ]/a/g' -e 's/[éÉèÈëËêÊēĒ]/e/g' -e 's/[íÍìÌïÏîÎīĪ]/i/g' \
  -e 's/[óÓòÒöÖôÔõÕøØōŌ]/o/g' -e 's/[úÚùÙüÜûÛūŪ]/u/g' -e 's/[ñÑ]/n/g' | \
  awk '{print tolower($0)}' | sed -E 's/ ([a-z])/\U\1/g' | sed 's/ //g'
}

# Función para convertir texto a PascalCase
toPascalCase() {
  echo "$1" | sed -e 's/[^a-zA-Z0-9 ]//g' \
  -e 's/[áÁàÀäÄâÂãÃåÅāĀ]/a/g' -e 's/[éÉèÈëËêÊēĒ]/e/g' -e 's/[íÍìÌïÏîÎīĪ]/i/g' \
  -e 's/[óÓòÒöÖôÔõÕøØōŌ]/o/g' -e 's/[úÚùÙüÜûÛūŪ]/u/g' -e 's/[ñÑ]/n/g' | \
  awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g'
}

# Función para convertir texto a kebab-case
toKebabCase() {
  echo "$1" | sed -e 's/[^a-zA-Z0-9 ]//g' \
  -e 's/[áÁàÀäÄâÂãÃåÅāĀ]/a/g' -e 's/[éÉèÈëËêÊēĒ]/e/g' -e 's/[íÍìÌïÏîÎīĪ]/i/g' \
  -e 's/[óÓòÒöÖôÔõÕøØōŌ]/o/g' -e 's/[úÚùÙüÜûÛūŪ]/u/g' -e 's/[ñÑ]/n/g' | \
  tr '[:upper:]' '[:lower:]' | sed 's/ /-/g'
}

# Función para convertir texto a snake_case
toSnakeCase() {
  echo "$1" | sed -e 's/[^a-zA-Z0-9 ]//g' \
  -e 's/[áÁàÀäÄâÂãÃåÅāĀ]/a/g' -e 's/[éÉèÈëËêÊēĒ]/e/g' -e 's/[íÍìÌïÏîÎīĪ]/i/g' \
  -e 's/[óÓòÒöÖôÔõÕøØōŌ]/o/g' -e 's/[úÚùÙüÜûÛūŪ]/u/g' -e 's/[ñÑ]/n/g' | \
  tr '[:upper:]' '[:lower:]' | sed 's/ /_/g'
}

# Función para convertir texto a SCREAMING_SNAKE_CASE
toScreamingSnakeCase() {
  echo "$1" | sed -e 's/[^a-zA-Z0-9 ]//g' \
  -e 's/[áÁàÀäÄâÂãÃåÅāĀ]/a/g' -e 's/[éÉèÈëËêÊēĒ]/e/g' -e 's/[íÍìÌïÏîÎīĪ]/i/g' \
  -e 's/[óÓòÒöÖôÔõÕøØōŌ]/o/g' -e 's/[úÚùÙüÜûÛūŪ]/u/g' -e 's/[ñÑ]/n/g' | \
  tr '[:lower:]' '[:upper:]' | sed 's/ /_/g'
}
