async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class Content extends React.Component {
    constructor() {
      super();
      this.state = { 
          travellers: [],
          showCompNum: 0
        };
      this.createTraveller = this.createTraveller.bind(this);
      this.deleteTraveller = this.deleteTraveller.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
    }
  
    async loadData() {
      const query = `query {
        travellerList {
          id name tel timeStamp
        }
      }`;

      const data = await graphQLFetch(query);

      if (data) {
        this.setState({ travellers: data.travellerList, showCompNum: 0});
      }
    }

    async createTraveller(traveller) {
      const query = `mutation travellerAdd($traveller: TravellerInputs!) {
        travellerAdd(traveller: $traveller) {
          id
        }
      }`;

      const queryBlackList = `query inBlackList($traveller: TravellerInputs!) {
        inBlackList(traveller: $traveller)
      }`;

      if (this.state.travellers.length < 25) {
        const inBlack = await graphQLFetch(queryBlackList, { traveller });

        if (!Boolean(inBlack.inBlackList)) {
          const data = await graphQLFetch(query, { traveller });

          if (data) {
            this.loadData();
          }
        }
        else {
          alert("This traveller is in BlackList!");
          this.setState({ travellers: this.state.travellers, showCompNum: 0 });
        }
      }
      else {
        alert("The reservation list is full, please try later!");
        this.setState({ travellers: this.state.travellers, showCompNum: 3 });
      }
    }

    async deleteTraveller(tid) {
      const query = `mutation travellerDelete($tid: Int!) {
        travellerDelete(tid: $tid) 
      }`;

      const data = await graphQLFetch(query, { tid });
      this.loadData();
    }
  
    render() {  
      return (
        <React.Fragment>
            <br/>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 0 })}}>Go Homepage</button>
            <button type="button" className="button" onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 1 })}}>Book a ticket</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 2 })}}>Delete a reservation</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 3 })}}>Disaplay reservation list</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 4 })}}>Show free seats</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, showCompNum: 5 })}}>Create a BlackList</button>
            <br/>
            <hr/>
            <br/>
            <DisplayHomepage style={{display:this.state.showCompNum==0?"":"none"}} />
            <AddTraveller style={{display:this.state.showCompNum==1?"":"none"}} createTraveller={this.createTraveller} />
            <DeleteTraveller style={{display:this.state.showCompNum==2?"":"none"}} travellers={this.state.travellers} deleteTraveller={this.deleteTraveller}/>
            <DisplayTravellers style={{display:this.state.showCompNum==3?"":"none"}} travellers={this.state.travellers} />
            <DisplayFreeSeats style={{display:this.state.showCompNum==4?"":"none"}} travellers={this.state.travellers} />
            <AddBlackList style={{display:this.state.showCompNum==5?"":"none"}} />
        </React.Fragment>
      );
    }
}

class DisplayHomepage extends React.Component {
  render() {  
    const style=this.props.style;
    return (
      <div style={style}>
        <br/>
        <br/>
        <h2>Welcome!</h2>
      </div>
    );
  }   
}

class AddTraveller extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.travellerAdd;
    const traveller = {
      name: form.name.value, tel: form.tel.value, 
    }

    this.props.createTraveller(traveller);
    form.name.value = ""; form.tel.value = "";
  }

  render() {
    const style=this.props.style;
    return (
      <div style={style}>
        <h2>Add a new traveller</h2>
        <br/>
        <br/>
        <form name="travellerAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Please input name"/>
          <br/>
          <br/>
          <input type="text" name="tel" placeholder="Please input phone number"/>
          <br/>
          <br/>
          <button>Submit</button>
        </form>
      </div>
    );   
  }
}

class DeleteTraveller extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.travellerDelete;
    const traveller = parseInt(form.id.value);
    this.props.deleteTraveller(traveller);
    form.id.value = "";
  }

  render() {
    const style=this.props.style;
    const idOptions = this.props.travellers.map(t =>
      <option key={t.id} value={t.id}>{t.id}: {t.name}</option>
    );
    return (
      <div style={style}>
        <h2>Please choose a traveller to delete</h2>
        <br/>
        <br/>
        <form name="travellerDelete" onSubmit={this.handleSubmit}>
          <select name="id">
            {idOptions}
          </select>
          <br/>
          <br/>
          <button>Submit</button>
        </form>
      </div>
    );   
  }  

}

class DisplayTravellers extends React.Component {
  render() {
    const style=this.props.style;
    const travellerRows = this.props.travellers.map(t =>
      <TravellerRow key={t.id} traveller={t} />
    );

    return (
      <div style={style}>
        <h2>Reservation List</h2>
        <br/>
        <br/>
        <table className="list">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {travellerRows}
          </tbody>
        </table>
      </div>
    );
  }
}

class DisplayFreeSeats extends React.Component {
  render() {
    const style=this.props.style;
    const occupied = this.props.travellers.length;
    const arr=[...Array(25)].map((k,i)=>i+1);
    const slots=arr.map(i => <p key={i} style={{background: i<=occupied?"#ff0000":"#bebebe"}}>{i}</p>);
    return (
      <div style={style}>
        <h2>Free Seats</h2>
        <div>
          {slots}
        </div>
      </div>
    );
  }
}

class AddBlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.travellerBlack;
    const traveller = {
      name: form.name.value, tel: form.tel.value, 
    }

    const query = `mutation mycreateBlackList($traveller: TravellerInputs!) {
      createBlackList(traveller: $traveller)
    }`;

    const data = await graphQLFetch(query, { traveller });
    form.name.value = ""; form.tel.value = "";
  }

  render() {
    const style=this.props.style;
    return (
      <div style={style}>
        <h2>Add a traveller to BlackList</h2>
        <br/>
        <br/>
        <form name="travellerBlack" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Please input name"/>
          <br/>
          <br/>
          <input type="text" name="tel" placeholder="Please input phone number"/>
          <br/>
          <br/>
          <button>Submit</button>
        </form>
      </div>
    );   
  }
}

class TravellerRow extends React.Component {
    render() {
      const traveller = this.props.traveller;
      return (
        <tr>
          <td>{traveller.id}</td>
          <td>{traveller.name}</td>
          <td>{traveller.tel}</td>
          <td>{traveller.timeStamp}</td>
        </tr>
      );
    }
}

  
const element = <Content />;

ReactDOM.render(element, document.getElementById('contents'));
  