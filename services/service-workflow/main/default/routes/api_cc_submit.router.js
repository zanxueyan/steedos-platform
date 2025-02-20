/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-11 14:50:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-14 11:34:38
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql')
const _ = require('lodash');
const Fiber = require("fibers");

const { workflowMethods } = require('@steedos/workflow')

router.post('/api/workflow/v2/cc_submit', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instanceId, traceId, approveId, description } = req.body;
        const approve = await objectql.getSteedosSchema().broker.call('instance.getApprove', {instanceId, traceId, approveId});
        Fiber(async function () {
            try {
                // Meteor.call('cc_submit', instanceId, description, myApprove, ccHasEditPermission, function (error, result) {})
                //TODO
                console.log('======cc_submit=====', instanceId, description, approve);
                const ccHasEditPermission = false;
                workflowMethods.cc_submit.apply({
                    userId: userSession.userId
                }, [
                    instanceId, description, approve, ccHasEditPermission, (error, result)=>{
                        if(error){
                            res.status(200).send({
                                error: error.message
                            });
                        }else{
                            res.status(200).send(result); 
                        }
                    }
                ])
                // Meteor.call('cc_submit', instanceId, description, approve, ccHasEditPermission, (error, result)=>{
                //     if(error){
                //         res.status(200).send({
                //             error: error.message
                //         });
                //     }else{
                //         res.status(200).send(result); 
                //     }
                // })
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});

exports.default = router;