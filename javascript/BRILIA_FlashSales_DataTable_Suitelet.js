function drawFlashSalesTable(request, response) {
    var html = nlapiLoadFile('SuiteScripts/flashSales/BRILIA_FlashSales_DataTable_Suitelet.html').getValue();
    html = html.replace('NL_DATA', getValues(getData()));
    response.write(html);
}

function getData() {
    var sales = nlapiSearchRecord('transaction', 'customsearch_flashsalesgross');
    var goals = nlapiSearchRecord('customrecord_bri_partnerquota', 'customsearch_flahsalesquotaregmanager');
    var bonification = nlapiSearchRecord('transaction', 'customsearch_flashsalesbonification');
    var cmv = nlapiSearchRecord('transaction', 'customsearch_flashsalescmv');
    var tax = nlapiSearchRecord('customrecord_enl_taxtrans', 'customsearch_flashsalestax');
    var avgPrice = nlapiSearchRecord('transaction', 'customsearch_flashsalesavgprice');
    //var customers = nlapiSearchRecord('transaction', 'customsearch_flashsalescustomers')


    var personas = [];
    sales.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        personas.push({
            id: element.getValue(recCollumns[0]),
            name: element.getText(recCollumns[0]),
            sales: element.getValue(recCollumns[1]),
            goal: 0.0,
            bonificationGoal: 0.0,
            bonification: 0.0,
            cmv: 0.0,
            tax: 0.0,
            averagePriceGoal: 0.0,
            averagePrice: 0.0,
            customersGoal: 0,
            customers: 0,
            customersNew: 0,
            devolutionGoal: 0.0,
            devolution: 0.0
        })
    }, this);

    goals.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].goal = element.getValue(recCollumns[1]);
    }, this);

    bonification.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].bonification = element.getValue(recCollumns[1]);
    }, this);

    cmv.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].cmv = element.getValue(recCollumns[1]);
    }, this);

    tax.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].tax = element.getValue(recCollumns[1]);
    }, this);

    avgPrice.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].averagePrice = element.getValue(recCollumns[1]);
    }, this);

    /*customers.forEach(function (element) {
        var recCollumns = element.getAllColumns();
        var idx = getIndexById(element.getValue(recCollumns[0]), personas);
        if (idx >= 0)
            personas[idx].customers = element.getValue(recCollumns[1]);
    }, this);*/



    return personas;
}

function getValues(personas) {
    var total = {
        id: 0,
        name: 'Total cia.',
        sales: 0.0,
        goal: 0.0,
        bonificationGoal: 0.0,
        bonification: 0.0,
        cmv: 0.0,
        tax: 0.0,
        averagePriceGoal: 0.0,
        averagePrice: 0.0,
        customersGoal: 0,
        customers: 0,
        customersNew: 0,
        devolutionGoal: 0.0,
        devolution: 0.0
    };

    personas.forEach(function (persona) {

        total.sales = Number(total.sales) + Number(persona.sales);
        total.goal += Number(persona.goal);
        total.bonificationGoal += Number(persona.bonificationGoal);
        total.bonification += Number(persona.bonification);
        total.cmv += Number(persona.cmv);
        total.tax += Number(persona.tax);
        total.averagePriceGoal += Number(persona.averagePriceGoal);
        total.averagePrice += Number(persona.averagePrice);
        total.customersGoal += Number(persona.customersGoal);
        total.customers += Number(persona.customers);
        total.customersNew += Number(persona.customersNew);
        total.devolutionGoal += Number(persona.devolutionGoal);
        total.devolution += Number(persona.devolution);
    }, this);

    total.averagePrice = total.averagePrice / personas.length;
    total.averagePriceGoal = total.averagePriceGoal / personas.length;

    var values = "";
    var workingDays = businessDays(new Date());

    personas.forEach(function (persona) {
        var MTDGoal = (persona.goal / parseFloat(workingDays[2])) * parseFloat(workingDays[0]);
        var TENDsales = parseFloat(persona.sales / parseFloat(workingDays[0])) * parseFloat(workingDays[2]);

        if (values)
            values += ',';
        values += drawLine([
            persona.name + hiddenField(persona.id), //Gerente Regional
            toPercent(persona.goal / total.goal), //SOS Meta
            toBold(toPercent(persona.sales / total.sales, true, ((persona.goal / total.goal) * 100) - 1, ((persona.goal / total.goal) * 100) + 1)), //SOS Real
            toCurrency(MTDGoal), //Meta MTD
            toCurrency(persona.sales), //Venda Líquida
            toBold(toPercent((persona.sales / MTDGoal), true, 75, 100)), //Atingimento
            toCurrency(MTDGoal - persona.sales), //Faltante
            toCurrency(persona.goal),//Meta
            toCurrency(TENDsales), //Tendência Vlíq
            toBold(toPercent((persona.sales / persona.goal), true, 75, 100)), //Atingimento
            toCurrency(persona.goal - persona.sales), //Faltante
            toCurrency((persona.goal - persona.sales) / parseFloat(workingDays[1])), //Necess diária
            '45%', //Margem meta
            toBold(toPercent(((persona.sales - persona.cmv - persona.tax) / (persona.sales - persona.tax)), true, 45, 46)), //Margem Real ToDo Verificar impostos
            toCurrency(persona.averagePriceGoal), //Preço Med Meta
            toCurrency(persona.averagePrice), //Preço Médio real
            persona.customersGoal, //Clientes Meta
            persona.customers, //Clientes Real
            persona.customersNew, //Clientes Novos
            toCurrency(persona.bonificationGoal), //Bonificação Meta
            toCurrency(persona.bonification), //Bonificação Real
            persona.devolutionGoal,
            toCurrency(persona.devolution)
        ]);
    }, this);
    //Totalizador
    var MTDGoalTotal = (total.goal / parseFloat(workingDays[2])) * parseFloat(workingDays[0]);
    var TENDSalesTotal = parseFloat(total.sales / parseFloat(workingDays[0])) * parseFloat(workingDays[2]);

    values += ',';
    values += drawLine([
        toBold(total.name) + hiddenField(total.id), //Gerente Regional
        toBold('100%'), //SOS Meta
        toBold('100%'), //SOS Real
        toBold(toCurrency(MTDGoalTotal)), //Meta MTD
        toBold(toCurrency(total.sales)), //Venda Líquida
        toBold(toPercent((total.sales / MTDGoalTotal), true, 75, 100)), //Atingimento
        toBold(toCurrency(MTDGoalTotal - total.sales)), //Faltante
        toBold(toCurrency(total.goal)),//Meta
        toBold(toCurrency(TENDSalesTotal)), //Tendência Vlíq
        toBold(toPercent((total.sales / total.goal), true, 75, 100)), //Atingimento
        toBold(toCurrency(total.goal - total.sales)), //Faltante
        toBold(toCurrency((total.goal - total.sales) / parseFloat(workingDays[1]))), //Necess diária
        toBold('45%'), //Margem meta
        toBold(toPercent(((total.sales - total.cmv - total.tax) / (total.sales - total.tax)), true, 45, 46)), //Margem Real ToDo Verificar impostos
        toBold(toCurrency(total.averagePriceGoal)), //Preço Med Meta
        toBold(toCurrency(total.averagePrice)), //Preço Médio real
        toBold(total.customersGoal), //Clientes Meta
        toBold(total.customers), //Clientes Real
        toBold(total.customersNew), //Clientes Novos
        toBold(toCurrency(total.bonificationGoal)), //Bonificação Meta
        toBold(toCurrency(total.bonification)), //Bonificação Real
        toBold(total.devolutionGoal),
        toBold(toCurrency(total.devolution))
    ]);
    return values;
}