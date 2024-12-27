/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable("tbl_employee", {
        employee_id: {
            type: "INTEGER",
            primaryKey: true,
            notNull:true,
        },
        employee_name: {
            type: "TEXT",
            notNull:true,
        },
        employee_manager_id: {
            type: "INTEGER",
            notNull:false,
        }
    });
    pgm.createTable("tbl_transaksi", {
        transaksi_id: {
            type: "SERIAL",
            primaryKey: true,
            notNull:true,
        },
        employee_id: {
            type: "INTEGER",
            notNull:true,
        },
        Amount: {
            type: "INTEGER",
            notNull:true,
        },
        tgl_transaksi: {
            type: "TIMESTAMP",
            notNull:true,
        }
    })

    pgm.createConstraint("tbl_transaksi", "FK_TBL_EMPLOYEE_TBL_TRANSAKSO", {
        foreignKeys: {
            columns: "employee_id",
            references: "tbl_employee(employee_id)",
            onDelete: "CASCADE",
        }
    })

    pgm.createTable("tbl_fee", {
        fee_id: {
            type: "SERIAL",
            primaryKey: true,
            notNull:true,
        },
        employee_id: {
            type: "INTEGER",
            notNull:true,
        },
        amount_fee: {
            type:"INTEGER",
            notNull:true,
        },
        tgl_fee: {
            type: "TIMESTAMP",
            notNull:true,
        }
    });
    pgm.createConstraint("tbl_fee", "FK_TBL_EMPLOYEE_TBL_FEE", {
        foreignKeys: {
            columns: "employee_id",
            references: "tbl_employee(employee_id)",
            onDelete: "CASCADE",
        }
    });
    pgm.createTable("log_transaksi", {
        log_id: {
            type: "SERIAL",
            primaryKey: true,
            notNull:true,
        },
        csv_filename: {
            type: "VARCHAR(255)",
            notNull:true,
        },
        total_record: {
            type: "INTEGER",
            notNull:true,
        },
        total_record_success: {
            type: "INTEGER",
            notNull:true,
        },
        total_record_failed: {
            type: "INTEGER",
            notNull:true,
        },
        failed_notes: {
            type: "VARCHAR(255)",
            notNull:true,
        },
        upload_date: {
            type: "TIMESTAMP",
            notNull:true,
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("log_transaksi");

    pgm.dropConstraint("tbl_fee", "FK_TBL_EMPLOYEE_TBL_FEE");
    pgm.dropTable("tbl_fee");

    pgm.dropConstraint("tbl_transaksi", "FK_TBL_EMPLOYEE_TBL_TRANSAKSO");
    pgm.dropTable("tbl_transaksi");

    pgm.dropTable("tbl_employee");
};
