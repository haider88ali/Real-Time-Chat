import React from 'react'

export const StudentPartial = (props) => {
    console.log("rpsops",props);
    const divStyle = {
      backgroundImage: `url(${props.data.avatar})`,
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      // You can add more background properties as needed
    };
  
  return (
    <>
    {props.data.name ?
        <div class="h-full bg-white shadow  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a>
              <div class=" h-[240px] bg-center relative flex items-end " style={divStyle}>
                <div class="absolute px-4 py-4">
              <img class="rounded-lg w-[90px] " src="https://media.istockphoto.com/id/1357352061/photo/smiling-african-american-child-school-boy-doing-homework-while-sitting-at-desk-at-home.jpg?s=612x612&w=0&k=20&c=J31K4oWAEcv_COW7BXX6Dm1uIo3VWiUEM2CmReHpt6U=" alt="" /> 
              </div>
              </div>
             
            </a>
            <div class="p-6 flex justify-between">
              <span>
              <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{props.data.name}</h5>
              <p class="font-sm text-gray-400 dark:text-gray-400">{props.data.email}.</p>
              </span>
              <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.001 7.8a2.2 2.2 0 1 0 0 4.402A2.2 2.2 0 0 0 10 7.8zm0-2.6A2.2 2.2 0 1 0 9.999.8a2.2 2.2 0 0 0 .002 4.4m0 9.6a2.2 2.2 0 1 0 0 4.402a2.2 2.2 0 0 0 0-4.402"/></svg>
              </span>
            </div>
          </div>
         : <></> }
    </>
  )
}
