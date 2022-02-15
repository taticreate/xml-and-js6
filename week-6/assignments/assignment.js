const htmlToElement = (html) => {
    const template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  };
  
  const loadData = (path, callback) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ({ target }) => {
      if (target.readyState == 4 && target.status == 200) {
        callback(target.responseXML);
      }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
  };
  
  const generateTableRow = (item) => {

    const id = Array.from(item.getElementsByTagName(`id`))[0];
    const firstname = Array.from(item.getElementsByTagName(`firstname`))[0];
    const lastname = Array.from(item.getElementsByTagName(`lastname`))[0];
    const email = Array.from(item.getElementsByTagName(`email`))[0];
    const gender = Array.from(item.getElementsByTagName(`gender`))[0];
    const ip = Array.from(item.getElementsByTagName(`ip`))[0];
    return `<tr>
      <td>${id.textContent}</td>
      <td>${firstname.textContent} ${lastname.textContent}</td>
      <td>${email.textContent}</td> 
      <td>${gender.textContent}</td> 
      <td>${ip.textContent}</td> 
    </tr>`;
  };
  
  const renderTable = (xmlData) => {
    const table = document.getElementById("main-table");
  
    if (!table) {
      throw new Error("No table element found");
    }
  
    const nodes = Array.from(xmlData.documentElement.childNodes).filter(
      ({ nodeName }) => nodeName === `person`
    );
  
    nodes.map((personNode) =>
      table.appendChild(htmlToElement(generateTableRow(personNode)))
    );
  };
  
  loadData(`http://localhost:8080/week-6/people.xml`, renderTable);
  
  const onReset = () => {
    window.location.replace(window.location.pathname);
  };
