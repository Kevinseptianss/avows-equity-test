const { Pool } = require("pg");

class TransactionService {
  constructor() {
    this._pool = new Pool();
  }

  async postTransaction(logTransaksi, logFee, log) {

    for (const trsc of logTransaksi) {
        const query = {
            text: `INSERT INTO tbl_transaksi (employee_id, "Amount", tgl_transaksi) VALUES($1, $2, $3)`,
            values: [trsc.employee_id, trsc.amount, trsc.tgl_transaksi],
        };
        await this._pool.query(query);
    }

    for (const fee of logFee) {
        const query = {
            text: "INSERT INTO tbl_fee (employee_id, amount_fee, tgl_fee) VALUES($1, $2, $3)",
            values: [fee.employee_id, fee.amount_fee, fee.tgl_fee],
        };
        await this._pool.query(query);
    }

    const query = {
        text: "INSERT INTO log_transaksi (csv_filename, total_record, total_record_success, total_record_failed, failed_notes, upload_date) VALUES($1, $2, $3, $4, $5, $6)",
        values: [log.csv_filename, log.total_record, log.total_record_success, log.total_record_failed, log.failed_notes, log.upload_date],
    };
    await this._pool.query(query);
    
    return "";
  }
}

module.exports = TransactionService;
