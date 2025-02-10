const apiJsonPath = '/json/apiUrls.json';

// ----------------------------- UTILITIES -----------------------------

const fetchWithTimeout = (url, options, timeout = 3000) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
            controller.abort(); // Прерываем запрос
            reject(new Error('Запрос превысил время ожидания'));
        }, timeout)
    );

    return Promise.race([
        fetch(url, { ...options, signal }), // Выполняем запрос
        timeoutPromise // Таймаут
    ]);
};

async function getApiUrls() {
    try {
        const response = await fetch(apiJsonPath);
        if(!response.ok){

        }
        return await response.json();
    } catch (error) {
        
    }
    
}

async function getSiteUrls() {
    try {
        const response = await fetch(siteJsonPath);
        if (!response.ok) {
            
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};