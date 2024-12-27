const { Pool } = require("pg");

class UsersServices {
  constructor() {
    this._pool = new Pool();
  }

  async getUsers() {
    const query = {
      text: "SELECT * FROM tbl_employee",
    };

    const result = await this._pool.query(query);
    let users = [];
    for (let i = 0; i < result.rows.length; i++) {
      if (result.rows[i].employee_manager_id == null) {
        const currentUsers = {
          employee_id: result.rows[i].employee_id,
          employee_name: result.rows[i].employee_name,
          employee_manager_name: null,
          path_level: 0,
          employeeFormat: ["Mary"],
          path_hierarchy: ["Mary"],
        };
        users.push(currentUsers);
      } else {
        const employeeMap = {};
        result.rows.forEach((emp) => {
          employeeMap[emp.employee_id] = emp;
        });

        function getHierarchyPath(employeeId) {
          const path = [];
          let currentEmployee = employeeMap[employeeId];

          while (currentEmployee) {
            path.unshift(currentEmployee.employee_name);
            currentEmployee = employeeMap[currentEmployee.employee_manager_id];
          }
          return path;
        }

        function getHierarchyChild(employeeId) {
            const children = result.rows.filter(
                (emp) => emp.employee_manager_id === employeeId
            );
            let allChild = [];
        
            children.forEach((child) => {
                allChild.push(child.employee_name); 
                allChild = allChild.concat(
                    getHierarchyChild(child.employee_id)
                );
            });

            return allChild;
        }

        function getEmployeeFormat(level, managerName) {
          let format = "";
          for (let i = 1; i <= level; i++) {
            if (i != level) {
              format += "  ";
            } else {
              format += "|__" + managerName;
            }
          }
          return format;
        }

        const hierarchyPath = getHierarchyPath(result.rows[i].employee_id);
        const currentEmployee = employeeMap[result.rows[i].employee_manager_id];
        const currentUsers = {
          employee_id: result.rows[i].employee_id,
          employee_name: result.rows[i].employee_name,
          employee_manager_name: currentEmployee.employee_name,
          path_level: hierarchyPath.length,
          employee_format: getEmployeeFormat(
            hierarchyPath.length,
            currentEmployee.employee_name
          ),
          path_hierarchy: hierarchyPath.join(" -> "),
          children_count: getHierarchyChild(result.rows[i].employee_id),
        };
        users.push(currentUsers);
      }
    }
    return users;
  }
}

module.exports = UsersServices;
