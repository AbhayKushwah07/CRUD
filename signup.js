const signup = document.getElementById('signup');
   
function save(){
  event.preventDefault();
  const data1 = new FormData(signup)
  const formData= Object.fromEntries(data1)

        const response = fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    
        }).then((response)=>{
         
        response.json().then((data)=>{
            if(data.success)
            {
                location.href='login.html'
            }
            else
            {
                alert(data.msg)
            }
        })
        
          
})
}

