export class ReportGenerator {
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

class ReportFormatter {
generateHeader(user) {
  throw new Error('Método não implementado');
}
generateItem(user, item) {
  throw new Error('Método não implementado');
}
generateFooter(total) {
  throw new Error('Método não implementado');
}
}

class CsvFormatter extends ReportFormatter {
generateHeader(user) {
  return 'ID,NOME,VALOR,USUARIO\n';
}
generateItem(user, item) {
  return `${item.id},${item.name},${item.value},${user.name}\n`;
}
generateFooter(total) {
  return `\nTotal,,\n${total},,\n`;
}
}

class HtmlFormatter extends ReportFormatter {
generateHeader(user) {
  return `\n`; 
} 
}