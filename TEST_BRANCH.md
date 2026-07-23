# Rama `test`

Esta rama existe únicamente como infraestructura: le da a Vercel un branch
estable para desplegar el ambiente de **test** persistente en
`first-backend-git-test-navike21.vercel.app`.

- No es una rama de feature — no se mergea a `main`.
- Se mantiene sincronizada con `main` (fast-forward) para que el ambiente de
  test corra siempre el código más reciente.
- El PR abierto contra `main` para esta rama existe solo para que la
  integración de Vercel con GitHub genere el deployment — se deja abierto a
  propósito, nunca se mergea ni se cierra.

Ver `CLAUDE.md` → sección "Ambientes" para el detalle completo de
development/test/production.
