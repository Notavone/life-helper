let columns1 = $("#columns1");
let columns2 = $("#columns2");
let budget = $("#budget");
let remaining = $("#remaining");

columns1.sortable({
    stop: () => {
        localStorage.setItem("columns1", columns1.html());
        progress();
    }
});
columns1.disableSelection();

columns2.sortable({
    stop: () => {
        localStorage.setItem("columns2", columns2.html());
    }
});
columns2.disableSelection();

function progress() {
    let _budget = Number(budget.val());
    let missing = 0;
    let show1, show2;

    if (columns1.children().length === 0) {
        remaining.val(`+${_budget}`);
        columns1.css("display", "none");
        show1 = false;
    } else {
        show1 = true;
    }

    if (columns2.children().length === 0) {
        columns2.css("display", "none");
        show2 = false;
    } else {
        show2 = true;
    }

    show1 !== false ? columns1.css("display", "block") : null;
    show2 !== false ? columns2.css("display", "block") : null;

    Array.from(columns1.children()).forEach((child) => {
        child = $(child);
        let price = child.val();
        if (_budget >= price) {
            _budget -= price;
            $(child.children()[1]).html('✔');
        } else if (price > _budget) {
            let miss = price - _budget;
            _budget = 0;
            missing += miss;
            if (price === miss) {
                $(child.children()[1]).html('❌');
            } else {
                $(child.children()[1]).html(`❌ (${miss.toFixed(2)}€)`);
            }
        }
        if (missing > 0) {
            remaining.val(`-${missing.toFixed(2)}`);
        } else {
            remaining.val(`+${_budget.toFixed(2)}`);
        }
    })
}

columns1.html(localStorage.getItem("columns1"));
columns2.html(localStorage.getItem("columns2"));
budget.val(localStorage.getItem("budget"));
progress();

budget.change(() => {
    localStorage.setItem("budget", budget.val());
    progress();
});

function adjust() {
    if (remaining.val().startsWith("+")) {
        budget.val(budget.val() - remaining.val());
    } else {
        budget.val(budget.val() - remaining.val());
    }
    localStorage.setItem("budget", budget.val());
    progress();
}

function del(element) {
    element.remove();
    localStorage.setItem("columns1", columns1.html());
    localStorage.setItem("columns2", columns2.html());
    progress();
}

function edit(element, _price, _name) {
    let name = prompt("Name", _name || "");
    let price = Number(prompt("Price", _price || ""));
    if (name === "null" || name.trim() === "" || price <= 0 || isNaN(price)) {
        return;
    }

    if (element) {
        $(element.parentNode).val(price);
        $($(element.parentNode).children()[0]).html(`${name} ${price}€`);
        $($(element.parentNode).children()[3]).attr("onclick", `edit(this, '${price}', '${name}')`);
    } else {
        columns1.append(`<li class="column" draggable="true" value="${price}"><span>${name} ${price}€</span> <span></span> <button class="right" onclick="del(this.parentNode)">🗑️</button><button class="right" onclick="edit(this, '${price}', '${name}')">✏</button></li>`);
    }

    localStorage.setItem("columns1", columns1.html());
    progress();
}

function newTask(element, _name, checked) {

    let name = prompt("Name", _name || "");
    if (name === "null" || name.trim() === "") {
        return;
    }

    if (element) {
        if (checked === 1) {
            $(element.parentNode).val('✔');
        } else {
            $(element.parentNode).val('❌');
        }
        $($(element.parentNode).children()[0]).html(name);
        $($(element.parentNode).children()[3]).attr("onclick", `newTask(this, '${name}')`);
    } else {
        columns2.append(`<li class="column" value="false" draggable="true"><span>${name}</span> <span>❌</span> <button class="right" onclick="del(this.parentNode)">🗑️</button><button class="right" onclick="newTask(this, '${name}')">✏</button><button class="right" onclick="toggleCheck(this.parentNode)">🔁</button></li>`);
    }

    localStorage.setItem("columns2", columns2.html());
    progress();
}

function toggleCheck(element) {
    if (element.value === 0) {
        $(element).val(1);
        $($(element).children()[1]).html('✔');
    } else {
        $(element).val(0);
        $($(element).children()[1]).html('❌');
    }
    localStorage.setItem("columns2", columns2.html());
}