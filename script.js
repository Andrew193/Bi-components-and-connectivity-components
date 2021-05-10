const bComponent = document.querySelector(".bComponent"),
placeForTempResults = document.querySelector("#tempResult"),
placeFortempResultSv = document.querySelector("#tempResultSv"),
componentsSv = document.querySelector(".componentsSv"),
DosMatrix = [],
ContrDosMatrix = [];
let SizeOfGraf = null;


function CreateMatrixDos() {

    let file = document.body.querySelector("#one").files[0];
    let reader = new FileReader();

    reader.readAsText(file, "UTF-8")

    reader.onload = function () {
        file = reader.result;
        SizeOfGraf = Number(file[0]);
        file = file.slice(1);
        if (Сheck(file)) { alert("Error! Invalid values."); }
        else {
            for (let i = 0; i < SizeOfGraf; i++) {
                DosMatrix[i] = [];
                ContrDosMatrix[i] = [];
                for (let j = 0; j < SizeOfGraf; j++) {
                    DosMatrix[i][j] = file[i * SizeOfGraf + j];
                }
            }
            TransponMatrix(DosMatrix, ContrDosMatrix);
            ShowBComponents(MakeResult(FindBcomponent(DosMatrix, ContrDosMatrix)));
            findComponentsSv();
        }
    };

    reader.onerror = function () {
        console.log(reader.error);
    };

}

function Сheck(MatrixInLine) {
    for (let i = 0; i < Math.pow(SizeOfGraf, 2); i++) {
        if (MatrixInLine[i] != '1' && MatrixInLine[i] != '0') {
            return true;
        }
    }
    return false;
}

function TransponMatrix(DosMatrix, ContrDosMatrix) {
    for (let i = 0; i < SizeOfGraf; i++) {
        for (let j = 0; j < SizeOfGraf; j++) {
            ContrDosMatrix[j][i] = DosMatrix[i][j];
        }
    }
}
function foo(i, mas) {
    let string = '';
    for (let j = 0; j < mas[i].length; j++){    string += ` v${mas[i][j]}`;}
    return string;
}
function FindBcomponent(DosMatrix, ContrDosMatrix) {
    //ищем пересечения
    placeForTempResults.innerHTML = "Здесь записываются пересечения в каждой строке обычной матрицы и транспонированной.<br>";
    let tempResult = [];
    for (let i = 0; i < SizeOfGraf; i++) {
        tempResult[i] = [];
        for (let j = 0; j < SizeOfGraf; j++) {
            if (DosMatrix[i][j] == 1 && ContrDosMatrix[i][j] == 1) {
                tempResult[i].push(j + 1);
            }
        }
        placeForTempResults.innerHTML += `Пересеклись: ${foo(i, tempResult)} - это ${i + 1} би компонента.<br>`;
    }
    placeForTempResults.innerHTML += "Дубли будут проигнорированы.<br>";
    return tempResult;
}


function MakeResult(tempResult) {
    for (let i = 0; i < tempResult.length; i++) {
        let counter = 0;
        for (let j = i + 1; j < tempResult.length; j++) {
            if (tempResult[i].length == tempResult[j].length) {
                for (let k = 0; k < tempResult[i].length; k++)
                    if (tempResult[i][k] == tempResult[i + 1][k])
                        counter++;
            }
        }
        if (counter >= tempResult[i].length) {
            tempResult.splice(i, 1);
        }
    }
    return tempResult;
}
function findComponentsSv() {
    let tempResult = [];
    let power = new Map();
    placeFortempResultSv.innerHTML = '';
    for (let i = 0; i < SizeOfGraf; i++) {
        tempResult[i] = [];
        for (let j = 0; j < SizeOfGraf; j++) {
            if (DosMatrix[i][j] == 1 || ContrDosMatrix[i][j] == 1) {
                tempResult[i].push(`${j + 1}`);
            }
        }
        placeFortempResultSv.innerHTML += `Совместно: ${foo(i, tempResult)}.<br>`;
    }

    for (let i = 0; i < tempResult.length; i++) {
        power.set(i + 1, tempResult[i].length)
    }
    power[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }
    let control = new Set();
    let masForTempComp = [];
    for (let i = 0; i < [...power].length; i++) {
        if (i == 0) {
            control.add(String([...power][i][0]));
            control.add(tempResult[[...power][i][0]][0]);
            masForTempComp.push(String([...power][i][0]));
            masForTempComp.push(tempResult[[...power][i][0]][0]);
            for (let j = 1; j < tempResult[[...power][i][0]].length; j++) {
                let flag = true;
                for (let p = 0; p < masForTempComp.length; p++) {
                    if (!tempResult[masForTempComp[0]].includes(masForTempComp[p])) {
                        flag = false;
                    }
                }
                if (flag) {
                    control.add(tempResult[[...power][i][0]][j])
                    if (Array.from(control.values()).length == tempResult.length) return
                    masForTempComp.push(tempResult[[...power][i][0]][j])
                }
            }
            let temp = Array.from(new Set(masForTempComp))
            componentsSv.innerHTML += "Cs: {"
            for (let w = 0; w < temp.length; w++)
                componentsSv.innerHTML += temp[w] += ", ";
            componentsSv.innerHTML += "}<br>"
        } else {
            if ([...power][i][1] == [...power][i - 1][1]) {
                continue;
            } else {
                if (Array.from(control.values()).length == tempResult.length) return
                control.add(String([...power][i][0]));
                control.add(tempResult[[...power][i][0]][0]);
                masForTempComp = [];
                masForTempComp.push(String([...power][i][0]));
                masForTempComp.push(tempResult[[...power][i][0]][0]);
                for (let j = 1; j < tempResult[[...power][i][0]].length; j++) {
                    let flag = true;
                    for (let p = 0; p < masForTempComp.length; p++) {
                        if (!tempResult[masForTempComp[0]].includes(masForTempComp[p])) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        control.add(tempResult[[...power][i][0]][j])
                        masForTempComp.push(tempResult[[...power][i][0]][j])
                    }
                }
                let temp = Array.from(new Set(masForTempComp))
                componentsSv.innerHTML += "Cs: {"
                for (let w = 0; w < temp.length; w++)
                    componentsSv.innerHTML += temp[w] += ", ";
                componentsSv.innerHTML += "}<br>"
            }
        }

    }

}
function ShowBComponents(result) {
    for (let i = 0; i < result.length; i++) {
        bComponent.innerHTML += `B${i + 1} = {`;
        for (let j = 0; j < result[i].length; j++) {
            bComponent.innerText += `V${result[i][j]}`;
            (j != result[i].length - 1)?bComponent.innerText += `,`:bComponent.innerText += `}, `
        }
    }
    bComponent.innerHTML += '<hr>';
}