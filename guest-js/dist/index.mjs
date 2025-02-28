import { invoke } from "@tauri-apps/api/tauri";

/**
 * **Database**
 *
 * The `Database` class serves as the primary interface for
 * communicating with the rust side of the sql plugin.
 */
class Database {
  constructor(path) {
    this.path = path;
  }
  /**
   * **load**
   *
   * A static initializer which connects to the underlying database and
   * returns a `Database` instance once a connection to the database is established.
   *
   * # Sqlite
   *
   * The path is relative to `tauri::api::path::BaseDirectory::App` and must start with `sqlite:`.
   *
   * @example
   * ```ts
   * const db = await Database.load("sqlite:test.db");
   * ```
   */
  static async load(path) {
    const _path = await invoke("plugin:sql|load", {
      db: path,
    });
    return new Database(_path);
  }
  /**
   * **get**
   *
   * A static initializer which synchronously returns an instance of
   * the Database class while deferring the actual database connection
   * until the first invocation or selection on the database.
   *
   * # Sqlite
   *
   * The path is relative to `tauri::api::path::BaseDirectory::App` and must start with `sqlite:`.
   *
   * @example
   * ```ts
   * const db = Database.get("sqlite:test.db");
   * ```
   */
  static get(path) {
    return new Database(path);
  }
  /**
   * **execute**
   *
   * Passes a SQL expression to the database for execution.
   *
   * @example
   * ```ts
   * const result = await db.execute(
   *    "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
   *    [ todos.title, todos.status, todos.id ]
   * );
   * ```
   */
  async execute(query, bindValues) {
    const [rowsAffected, lastInsertId] = await invoke("plugin:sql|execute", {
      db: this.path,
      query,
      values: bindValues !== null && bindValues !== void 0 ? bindValues : [],
    });
    return {
      lastInsertId,
      rowsAffected,
    };
  }
  /**
   * **select**
   *
   * Passes in a SELECT query to the database for execution.
   *
   * @example
   * ```ts
   * const result = await db.select(
   *    "SELECT * from todos WHERE id = $1", id
   * );
   * ```
   */
  async select(query, bindValues) {
    const result = await invoke("plugin:sql|select", {
      db: this.path,
      query,
      values: bindValues !== null && bindValues !== void 0 ? bindValues : [],
    });
    return result;
  }
  /**
   * **close**
   *
   * Closes the database connection pool.
   *
   * @example
   * ```ts
   * const success = await db.close()
   * ```
   * @param db - Optionally state the name of a database if you are managing more than one. Otherwise, all database pools will be in scope.
   */
  async close(db) {
    const success = await invoke("plugin:sql|close", {
      db,
    });
    return success;
  }
}

export { Database as default };
//# sourceMappingURL=index.mjs.map
