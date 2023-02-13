const theme = {
  menu: {
    triggerButton:
      'inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5',
    menuItem: (props?: { active?: boolean }) =>
      `flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer ${
        props?.active ? 'text-blue-300' : ''
      }`,
    content:
      'py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80'
  }
}

export default theme
