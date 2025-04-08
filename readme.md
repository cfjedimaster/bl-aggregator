# BoxLang Aggregator

This is a simple BoxLang based blog aggregator. On a regular schedule, it will check various blog RSS feeds, store the results in a database, and then provide a simple interface to view them.

## To Do

Define these environment settings with correct values:

* MYSQL_HOST
* MYSQL_PORT
* MYSQL_USERNAME
* MYSQL_PWORD

Install the MySQL module:

```
install-bx-module bx-mysql
```

A data dump of the schema and initial blogs may be found in `aggregator.sql`.