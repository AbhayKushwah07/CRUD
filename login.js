const loginform = document.getElementById('login');
   
function save(){
  event.preventDefault();
  const data1 = new FormData(loginform)
  const formData= Object.fromEntries(data1)
  
        const response = fetch('http://localhost:3000/login', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    
        }).then((response)=>{
         
        response.json().then((data)=>{
            if(data.success)
            {
                location.href='dashboard.html'
            }
            else
            {
                alert("invalid credentials")
            }
        })
        
          
})
}

