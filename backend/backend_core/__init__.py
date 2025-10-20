

"""Backend core package initialization.

This enables PyMySQL to act as a drop-in replacement for MySQLdb,
which simplifies running the project on Windows where mysqlclient
is harder to install.
"""

try:
	import pymysql  # type: ignore

	pymysql.install_as_MySQLdb()
except Exception:
	# If PyMySQL isn't available, ignore; Django will try mysqlclient.
	# This allows environments with mysqlclient to work without PyMySQL.
	pass


