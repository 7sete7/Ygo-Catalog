export class AuthService {
  constructor() {
    this.authPath = `${process.env.REACT_APP_API_URL}${
      process.env.REACT_APP_API_PORT
    }${process.env.REACT_APP_API_PATH}/auth`;
  }

  logIn(data) {
    fetch(this.authPath, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(data)
    })
      .then(result => result.json())
      .then(token => {
        if (!token.auth) throw "Login inválido!";

        localStorage.setItem("token", JSON.stringify(token.token).replace(/"/g, ""));
        window.location.replace("/");
        return Promise.resolve(token);
      });
  }

  isLoggedIn() {
    let g = localStorage.getItem("token");
    return g != null && g != undefined;
  }

  async getUserData() {
    const data = await fetch(this.authPath, {
        method: "GET",
        headers: new Headers({
            "x-access-token": localStorage.getItem("token")
        })
    })
    .then(res => res.json())
    .catch(console.error);

    return data;
  }

  logOut() {
    localStorage.removeItem("token");
    window.location.replace("/login");
  }

  // getChildrens(childrens){
  //     return React.Children.map(childrens, child => {
  //         let childProps = {};

  //         if(!React.isValidElement(child)) return child;
  //         if(child.props){
  //             if(/email|senha|submit/.test(child.props.id))
  //                 childProps = this.newProps(child);

  //             childProps.children = this.getChildrens(child.props.children);
  //         }
  //         return React.cloneElement(child, childProps);
  //     });
  // }

  // newProps(element){
  //     return element.type.name == "Input"
  //          ? {onChange: this.handleChange}
  //          : {onClick: this.submit};
  // }
}
