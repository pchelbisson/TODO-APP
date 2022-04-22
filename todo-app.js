(function () {
  let listArray = [],
    listName = "";
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h1");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let inputWrapper = document.createElement("div");
    let input = document.createElement("input");
    let button = document.createElement("button");

    form.classList.add("todo-form");
    inputWrapper.classList.add("input-container");
    input.classList.add("todo-input");
    input.placeholder = "...";
    input.type = "text";
    button.classList.add("todo-button");
    button.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    // устанавливаем кнопку Добавить по умолчанию неактивной
    button.disabled = true;
    button.type = "submit";

    inputWrapper.append(input);
    inputWrapper.append(button);

    form.append(inputWrapper);

    // делаем кнопу Добавить активной, когда значение перестает быть пустым
    input.addEventListener("input", function () {
      //срезаем пробелы в начале и конце введенных значений
      if (input.value.trim() !== "") {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");

    list.classList.add("todo-list");

    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add("todo");
    item.textContent = obj.name;

    buttonGroup.classList.add("btn");
    doneButton.classList.add("complete-btn");
    doneButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    deleteButton.classList.add("trash-btn");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    if (obj.done == true) item.classList.add("list-group-item-success");

    // добавляем обработчики на кнопки
    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");

      // проходим циклом по объектам массива всего
      for (const listItem of listArray) {
        // при клике на дело, меняется статус true/false (готово/не готово)
        if (listItem.id == obj.id) listItem.done = !listItem.done;
      }
      saveList(listArray, listName);
    });
    deleteButton.addEventListener("click", function () {
      //добавляем класс с анимацией
      item.classList.add("fall");
      for (let i = 0; i < listArray.length; i++) {
        // удаляем из массива объект при нажатии УДАЛИТЬ
        if (listArray[i].id == obj.id) listArray.splice(i, 1);
      }
      saveList(listArray, listName);
      item.addEventListener("transitionend", function () {
        item.remove();
      });
    });

    // вкладываем кнопки в один элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }
  // создаем оригинальный ID для наших объектов
  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }
  // сохранение данных
  function saveList(arr, keyName) {
    // преобразуем наш объект в строки
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = "Список дел", keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    //listArray = defaultArr;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);
    // проверка на пустоту
    if (localData !== null && localData !== "") {
      //возвращаем объекты
      listArray = JSON.parse(localData);
    }

    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewId(listArray),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(newItem);

      listArray.push(newItem);
      // сохраняем наши данные при любом изменении в local storage
      saveList(listArray, listName);
      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      // после ввода нового дела, кнопка снова деактивируется при пустом поле
      todoItemForm.button.disabled = true;
      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
