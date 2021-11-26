/*
    модель элемента списка
    {
        id: '', // string
        title: '', // string
        isDone: false, // bool
        timeStamp: 0 // number
    }
*/

const defaultItems = [{
        id: '3234923948243',
        title: '🥖 Купить хлеб',
        isDone: false,
        timeStamp: 1637744893677
    }, {
        id: '93485739485345',
        title: '🧾 Оплатить счета',
        isDone: true,
        timeStamp: 1634844894677
    }, {
        id: '234924853945',
        title: '🌏 🔫 Захватить мир',
        isDone: false,
        timeStamp: 1632844984677
    }
]

class ListStore {
    constructor({ localStorageKey = 'STORE' }) {
        if(!window.localStorage) return new Error('localStorage not support!')
        this.localStorageKey = localStorageKey
        this.emitFunc = null
        this.declinationCounter = ['дело', 'дела', 'дел']
        // расскоментить строку снизу чтобы отображался дефолтный лист
        // localStorage.setItem(localStorageKey, JSON.stringify(defaultItems))
    }

    // добавляет нужное числительное к числу
    _getDeclinationOfNum(number, titles) {  
        const cases = [2, 0, 1, 1, 1, 2];  
        return `${number} ${titles[( number % 100 > 4 && number % 100 < 20 ) ? 2 : cases[( number % 10 < 5 ) ? number % 10 : 5 ]]}`;
    }

    // вспомогательный метод: возвращает массив элементов из стора
    _getData() {
        try {
            return JSON.parse(localStorage.getItem(this.localStorageKey))
        } catch (e) {
            console.error(e)
            return []
        }
    }

    // вспомогательный метод: сохраняет переданный массив элементов в стор
    _setData(data) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(data))
        } catch (e) {
            console.error(e)
        }
        return
    }

    // вызывает переданный callback чтобы обновлять верстку после изменений списка
    _emit() {
        this.emitFunc.call(null, this._getData(), this.countTodo)
    }

    // добавляем новый элемент в конец массива
    add(data = {}) {
        if(typeof data !== 'object') {
            return new Error('add method accept only object!')
        }
        let arrayList = this._getData()
        arrayList.push(data)
        this._setData(arrayList)
        this._emit()
        return
    }

    // удаляет один элемент из массива
    remove(id = null) {
        if(!id) return new Error('remove method must take id param!')
        const newData = this._getData().filter(item => item.id !== id)
        this._setData(newData)
        this._emit()
    }

    // меняет стаус у выбранного элемента
    toggleStatus(id = null, isDone) {
        if(!id) return new Error('toggleStatus method must take id param!')
        const newData = this._getData().reduce((acc, item) => {
            const res = item
            if(res.id === id) {
                res.isDone = isDone
            }
            return [ ...acc, res ]
        }, [])
        this._setData(newData)
        this._emit()
    }

    // возвращает количество всех добаленных элементов
    get countAll() {
        if(typeof this._getData().length !== 'undefined') {
            const result = this._getData().length
            return this._getDeclinationOfNum(result, this.declinationCounter)
        } else {
            return this._getDeclinationOfNum(0, this.declinationCounter)
        }
    }

    // возвращает количество элементов у которых статус isDone === false
    get countTodo() {
        if(typeof this._getData().length !== 'undefined') {
            const result = this._getData().filter(({ isDone }) => !isDone).length
            return this._getDeclinationOfNum(result, this.declinationCounter)
        } else {
            return this._getDeclinationOfNum(0, this.declinationCounter)
        }
    }

    // очищает массив с сохраненными элементами
    clear() {
        localStorage.setItem(this.localStorageKey, [])
        this._emit()
        return
    }

    // возвращает массив с сохраненными элементами
    get list() {
        if(localStorage.getItem(this.localStorageKey)) {
            return JSON.parse(localStorage.getItem(this.localStorageKey))
        } else {
            return []
        }
    }

    // принимает функцию, которая будет вызываться при изменениях списка
    subscribeToUpdateList(callback) {
        this.emitFunc = callback
    }
}