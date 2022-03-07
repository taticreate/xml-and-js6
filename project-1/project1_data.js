const xhttp = new XMLHttpRequest();
const table = document.getElementById(`generated-content`);
const filtersEnabled = Boolean(window.location.search);

xhttp.onreadystatechange = ({ target }) => {
    if (target.readyState == 4 && target.status == 200) {
        loadFile(target);
    }
};

xhttp.open("GET", "http://localhost:8080/project-1/project1_data.xml", true);
xhttp.send();

const htmlToElement = html => {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
};

const generateRow = (item, priceFilter) => {
    const name = item.getElementsByTagName(`Name`)[0];
    const size = item.getElementsByTagName(`Size`)[0];
    const finish = item.getElementsByTagName(`DeskFinish`)[0];
    const prices = item.getElementsByTagName(`Prices`)[0];
    const image = item.getElementsByTagName(`Image`)[0];
    const description = item.getElementsByTagName(`Description`)[0];
    const dimensions = item.getElementsByTagName(`Dimentions`)[0];
    const link = item.getElementsByTagName(`link`)[0];

    const width = dimensions.getElementsByTagName(`w`)[0];
    const height = dimensions.getElementsByTagName(`h`)[0];
    const depth = dimensions.getElementsByTagName(`d`)[0];

    const currency = prices.attributes[0];
    const sizeUnit = size.attributes[0];

    const priceElements = prices.getElementsByTagName(`Price`);
    let priceString = Array.from(priceElements).map(price => {
        if (priceFilter && priceFilter.length > 0 && priceFilter != price.attributes[0].textContent) return undefined;
        return `${price.attributes[0].textContent}: ${price.textContent} ${currency.textContent}`;
    }, "");

    priceString = priceString.filter(price => typeof price != `undefined`).join(`<br>`);

    const dimensionString = `Width: ${width.textContent} ${width.attributes[0].textContent}<br>
    Height: ${height.textContent} ${height.attributes[0].textContent}<br>
    Depth: ${depth.textContent} ${depth.attributes[0].textContent}`;

    return `<tr>
        <td>${name.textContent}</td>
        <td>${size.textContent} ${sizeUnit.textContent}</td>
        <td>${finish.textContent}</td>
        <td>${priceString}</td>
        <td><img src="images/${image.textContent}" width="100" height="100"></td>
        <td>${description.textContent}</td>
        <td>${dimensionString}</td>
        <td><a href="${link.textContent}" target="_blank">Link</a></td>
    </tr>`;
}

const isFiltered = item => {
    const params = new URLSearchParams(window.location.search);
    const sizeFilters = params.getAll(`size`);
    const size = parseInt(item.getElementsByTagName(`Size`)[0].textContent);

    let sizeFilterPassed = sizeFilters.length == 0;
    sizeFilters.forEach(filter => {
        const sizeLimits = filter.split(`-`);
        if (parseInt(sizeLimits[0]) <= size && parseInt(sizeLimits[1]) >= size) sizeFilterPassed = true;
    });
    if (!sizeFilterPassed) return true;

    const keywordFilter = params.get(`search`);
    const name = item.getElementsByTagName(`Name`)[0].textContent;
    const finish = item.getElementsByTagName(`DeskFinish`)[0].textContent;
    const description = item.getElementsByTagName(`Description`)[0].textContent;

    let keywordFilterPassed = keywordFilter.length == 0;
    [name, finish, description].forEach(text => {
        if (text.toLowerCase().includes(keywordFilter.toLowerCase())) keywordFilterPassed = true;
    });
    if (!keywordFilterPassed) return true
}

const generateRows = item => {
    const tables = Array.from(item.getElementsByTagName(`Table`));
    return tables.reduce((prev, current) => {
        const itemFiltered = filtersEnabled && isFiltered(current);
        const params = new URLSearchParams(window.location.search);
        const priceFilter = params.get(`price`);
        return itemFiltered ? prev : prev + generateRow(current, priceFilter);
    }, "");
};

const configureFilterControls = () => {
    if (!filtersEnabled) return;
    const params = new URLSearchParams(window.location.search);
    const priceFilter = params.get(`price`);
    if (priceFilter.length > 0) {
        const radio = document.getElementById(`price${priceFilter}`);
        radio.checked = true;
    }

    const sizeFilters = params.getAll(`size`);
    sizeFilters.forEach(filter => {
        const checkbox = document.getElementById(`size${filter.split(`-`)[0]}`);
        checkbox.checked = true;
    });

    const keywordFilter = params.get(`search`);
    if (keywordFilter.length > 0) {
        const textField = document.getElementById(`startsearch`);
        textField.value = keywordFilter;
    }
}

const onReset = () => window.location.replace(window.location.pathname);
const loadFile = xml => table.appendChild(htmlToElement(generateRows(xml.responseXML)));

configureFilterControls();
