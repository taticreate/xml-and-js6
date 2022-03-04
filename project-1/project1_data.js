

const reset = () => {
    window.location.replace(window.location.pathname);
};


loadData(`http://localhost:8080/project1_data.xml`, renderTable);
