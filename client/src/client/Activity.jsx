/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons'),
    _ = require('lodash'),
    actionString;

module.exports = React.createClass({
    getDefaultProps: function() {
    return {
            navable: false,
            subNavable: true,
            navStack: 1,
            icon: "ion-game-controller-a ",
            functionCall: "viewMessages",
            username: "Unkown",
            action: "gameplay",
            game: null,
            actionSet: [],
            actionString: "recently played",
            timestamp: null
        }
    },
    render: function() {

        var actionString = _.filter(this.props.actionSet, {"type": this.props.action});
                    
        var cx = React.addons.classSet;
        var classes = cx({
            'square': true
        });
        return (
        
        <tr className={this.props.subNavable ? "subNavable" : ""} data-snav={this.props.navStack}>
            <td className="td_square"><div className={classes +" "+ actionString[0].color}><i className={actionString[0].icon}></i></div></td>
            <td><strong>{this.props.username}</strong><br /> 
            {actionString[0].string} {this.props.game}</td>
            <td className="text-right"> {this.props.timestamp}</td>
        </tr>

        );
    }
});



