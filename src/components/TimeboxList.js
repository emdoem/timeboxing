import React from 'react';

import TimeboxCreator from "./TimeboxCreator";
import Timebox from "./Timebox";
import Error from "./ErrorBoundary";
import TimeboxesAPI from "../api/FakeTimeboxesAPI"



class TimeboxList extends React.Component {
    state = {
        timeboxes: [],
        loading: true,
        error: null
    }   
    
    componentDidMount() {
        TimeboxesAPI.getAllTimeboxes().then(
            (timeboxes) => this.setState({ timeboxes })
        ).catch(
            (error) => this.setState({ error })
        ).finally(
            () => this.setState({loading: false})
        )
    }
    
    addTimebox = (timebox) => {
        TimeboxesAPI.addTimebox(timebox).then(
           (addedTimebox) => this.setState(prevState => {
                const timeboxes = [...prevState.timeboxes, addedTimebox];
                return { timeboxes };
            }
        ) 
        )
        
    }

    removeTimebox = (indexToRemove)=> {
        TimeboxesAPI.removeTimebox(this.state.timeboxes[indexToRemove]).then(
            () => this.setState(prevState => {
                const timeboxes = prevState.timeboxes.filter((timebox, index) => 
                    index !== indexToRemove
                );
                return { timeboxes };
            })
        )
    }

    updateTimebox = (indexToUpdate, timeboxToUpdate) => {
        TimeboxesAPI.replaceTimebox(timeboxToUpdate)
            .then(
                (updatedTimebox) => this.setState(prevState => {
                    const timeboxes = prevState.timeboxes.map((timebox, index) =>
                        index === indexToUpdate ? updatedTimebox : timebox
                    );
                    return { timeboxes };
                })
            )
        
    }

    handleCreate = (createdTimebox) => {
        try {
            this.addTimebox(createdTimebox);
        } catch (error) {
            console.log("Wystąpił błąd przy tworzeniu timeboxa: ", error);
        }
    }

    render () {
        console.table(this.state.timeboxes);
        return (
            <>
                <TimeboxCreator onCreate={this.handleCreate} />
                { this.state.loading ? "Timeboxy się ładują..." : null }
                { this.state.error ? "Coś się wykrzaczyło w liście :(" : null}
                <Error message="Coś się wykrzaczyło w liście :(">
                { 
                   this.state.timeboxes.map((timebox, index) => (
                       <Error message="Coś się wykrzaczyło w timeboksie :(">
                       <Timebox 
                           key={timebox.id} 
                           title={timebox.title} 
                           totalTimeInMinutes={timebox.totalTimeInMinutes} 
                           onDelete={() => this.removeTimebox(index)}
                           onEdit={(updatedTimebox) => {
                               this.updateTimebox(index, {
                                   ...timebox, 
                                   title: updatedTimebox.updatedTitle
                               });
                           }}
                       />
                       </Error>
                   ))
                }
                </Error>
                
                                 
            </>
        )
    }
}

export default TimeboxList;