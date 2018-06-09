const clearActive = () => {
    document.querySelectorAll(".is-active").forEach((val)=>{
        val.classList.remove('is-active')
        val.style.border = 'none';
        val.style.backgroundColor = '';
    })
};

export default clearActive;