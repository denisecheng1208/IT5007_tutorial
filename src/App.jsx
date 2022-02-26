const initialTravellers = [
    {
        id: 1,
        name: 'Alice',
        tel: 123456,
        timeStamp: new Date('2022-02-15')
    },
    {
        id: 2,
        name: 'Bob',
        tel: 654321,
        timeStamp: new Date('2022-02-16')
    }
];


class Content extends React.Component {
    constructor() {
      super();
      this.state = { 
          travellers: [],
          count: 0,
          showCompNum: 0
        };
      this.createTraveller = this.createTraveller.bind(this);
      this.deleteTraveller = this.deleteTraveller.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
    }
  
    loadData() {
      setTimeout(() => {
        this.setState({ travellers: initialTravellers, count: 2, showCompNum: 0 });
      }, 500);
    }

    createTraveller(traveller) {
      if (this.state.travellers.length < 25) {
        traveller.id = this.state.count + 1;
        traveller.timeStamp = new Date();
        const newTravellersList = this.state.travellers.slice();
        newTravellersList.push(traveller);
        this.setState({ travellers: newTravellersList,  count: this.state.count+1, showCompNum: 3 });
      }
      else {
        alert("The reservation list is full, please try later!");
        this.setState({ travellers: this.state.travellers,  count: this.state.count, showCompNum: 3 });
      }
    }

    deleteTraveller(traveller) {
      const newTravellersList = this.state.travellers.filter((t)=>{return t.id!=traveller.id});
      this.setState({ travellers: newTravellersList, count: this.state.count, showCompNum: 3 });
    }
  
    render() {  
      return (
        <React.Fragment>
            <br/>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, count: this.state.count, showCompNum: 0 })}}>Go Homepage</button>
            <button type="button" className="button" onClick={()=>{this.setState({ travellers: this.state.travellers, count: this.state.count, showCompNum: 1 })}}>Book a ticket</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, count: this.state.count, showCompNum: 2 })}}>Delete a reservation</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, count: this.state.count, showCompNum: 3 })}}>Disaplay reservation list</button>
            <button type="button" className="button" style={{display:this.state.showCompNum==1?"none":""}} onClick={()=>{this.setState({ travellers: this.state.travellers, count: this.state.count, showCompNum: 4 })}}>Show free seats</button>
            <br/>
            <hr/>
            <br/>
            <DisplayHomepage style={{display:this.state.showCompNum==0?"":"none"}} />
            <AddTraveller style={{display:this.state.showCompNum==1?"":"none"}} createTraveller={this.createTraveller} />
            <DeleteTraveller style={{display:this.state.showCompNum==2?"":"none"}} travellers={this.state.travellers} deleteTraveller={this.deleteTraveller}/>
            <DisplayTravellers style={{display:this.state.showCompNum==3?"":"none"}} travellers={this.state.travellers} />
            <DisplayFreeSeats style={{display:this.state.showCompNum==4?"":"none"}} travellers={this.state.travellers} />
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
    const traveller = {
      id: form.id.value,
    }
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


class TravellerRow extends React.Component {
    render() {
      const traveller = this.props.traveller;
      return (
        <tr>
          <td>{traveller.id}</td>
          <td>{traveller.name}</td>
          <td>{traveller.tel}</td>
          <td>{traveller.timeStamp.toLocaleString()}</td>
        </tr>
      );
    }
}

  
const element = <Content />;

ReactDOM.render(element, document.getElementById('contents'));
  