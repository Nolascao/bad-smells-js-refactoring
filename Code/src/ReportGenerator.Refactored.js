class ReportGenerator {
constructor(database) {
  this.db = database;
}

generateReport(reportType, user, items) {
  const formatter = this.getFormatter(reportType);
  let total = 0;

  let report = formatter.generateHeader(user);

  for (const item of items) {
    if (this.shouldIncludeItem(user, item)) {
      this.applyPriorityIfNeeded(user, item);
      report += formatter.generateItem(user, item);
      total += item.value;
    }
  }

  report += formatter.generateFooter(total);
  return report.trim();
}

shouldIncludeItem(user, item) {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'USER') return item.value <= VALUE_LIMIT_USER;
  return false;
}

applyPriorityIfNeeded(user, item) {
  if (user.role === 'ADMIN' && item.value > VALUE_PRIORITY_ADMIN) {
    item.priority = true;
  }
}

getFormatter(reportType) {
  switch (reportType) {
    case 'CSV':
      return new CsvFormatter();
    case 'HTML':
      return new HtmlFormatter();
    default:
      throw new Error(`Tipo de relatório não suportado: ${reportType}`);
  }
}
}

const VALUE_PRIORITY_ADMIN = 1000;
const VALUE_LIMIT_USER = 500;
const NOT_IMPLEMENTED_ERROR = 'Método não implementado';

class ReportFormatter {
generateHeader() {
  throw new Error(NOT_IMPLEMENTED_ERROR);
}
generateItem() {
  throw new Error(NOT_IMPLEMENTED_ERROR);
}
generateFooter() {
  throw new Error(NOT_IMPLEMENTED_ERROR);
}
}

class CsvFormatter extends ReportFormatter {
generateHeader() {
  return 'ID,NOME,VALOR,USUARIO\n';
}
generateItem(user, item) {
  return `${item.id},${item.name},${item.value},${user.name}\n`;
}
generateFooter(total) {
  return `Total,,\n${total},,\n`;
}
}

class HtmlFormatter extends ReportFormatter {
generateHeader(user) {
  return `<html><body>
<h1>Relatório</h1>
<h2>Usuário: ${user.name}</h2>
<table>
<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>
`;
  }
  
  generateItem(user, item) {
    if (item.priority) {
      return `<tr style="font-weight:bold;"><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }
  
  generateFooter(total) {
    return `</table>
<h3>Total: ${total}</h3>
</body></html>\n`; } }

module.exports = { ReportGenerator };