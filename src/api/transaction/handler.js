class TransactionHandler {
  constructor(service, users) {
    this._service = service;
    this._users = users;

    this.postTransactionHandler = this.postTransactionHandler.bind(this);
  }

  async postTransactionHandler(request, h) {
    const file = request.payload.file;
    const listEmployee = await this._users.getUsers();

    if (!file) {
      return h
        .response({ status: "error", message: "File is required" })
        .code(400);
    }

    try {
      const content = await readFileContent(file);

      let log = {
        csv_filename: file.hapi.filename,
        total_record: 0,
        total_record_success: 0,
        total_record_failed: 0,
        failed_notes: "",
        upload_date: new Date().toISOString(), // Set the upload date
      };

      let logTransaksi = [];
      let logFee = [];

      content.split("\n").forEach((row) => {
        if (row.trim() === "") return;

        log.total_record++;
        const dataRow = parseData(row);
        let isExist = false;

        listEmployee.forEach((list) => {
          if (list.employee_id == dataRow.id) {
            const transaksi = {
              employee_id: dataRow.id,
              amount: dataRow.amount,
              tgl_transaksi: dataRow.date,
            };
            logTransaksi.push(transaksi);

            const getChild = list.children_count.length || 1;
            const fee = {
              employee_id: dataRow.id,
              amount_fee: dataRow.amount * (1 / getChild),
              tgl_fee: dataRow.date,
            };
            logFee.push(fee);
            log.total_record_success++;
            isExist = true;
          }
        });

        if (!isExist) {
          log.total_record_failed++;
          log.failed_notes += `ID: (${dataRow.id}) tidak dapat ditemukan\n`;
        }
      });

      await this._service.postTransaction(logTransaksi, logFee, log);
      const response = h.response({
        status: "success",
        message: "File processed successfully",
        data: content.split("\n"),
        list: listEmployee,
        logTransaksi: logTransaksi,
        logFee: logFee,
        log: log,
      });
      response.code(200); 
      return response;
    } catch (error) {
      console.error("Error reading file:", error);
      return h
        .response({
          status: "error",
          message: "An error occurred while processing the file.",
        })
        .code(500);
    }
  }
}

function parseData(dataString) {
  const parts = dataString.split(";");
  const [id, amount, date] = parts;

  return {
    id: parseInt(id, 10),
    amount: parseFloat(amount),
    date: date,
  };
}

function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    console.log(file);
    file.on("data", (chunk) => {
      chunks.push(chunk);
    });

    file.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const content = buffer.toString("utf8");
      resolve(content);
    });

    file.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = TransactionHandler;
