import path from 'path';
import fs from 'fs/promises'; 
import crypto from 'crypto';
import { futimes } from 'fs';
import { timeStamp } from 'console';
import { diffLines } from 'diff';
import chalk from 'chalk';
import { Command } from 'commander';




const program = new Command();



class nogit 
{
    constructor(repoPath = '.')
    {
        this.repoPath = path.join(repoPath, '.nogit');//we will create a .git folder to manage (.nogit)
        this.objectsPath = path.join(this.repoPath, 'object'); // will create objects folder
        this.headPath = path.join(this.repoPath, 'HEAD'); // will create head files 
        //for the next edit 
        this.indexPath = path.join(this.repoPath, 'index'); //this will keep datails for the staging area 
        this.init();
    }

    async init()
    {
        await fs.mkdir(this.objectsPath,{recursive: true}); // will create the folder
        try 
        {
            await fs.writeFile(this.headPath, '' , {flag : 'wx'}) // write only if the file does not exists
            await fs.writeFile(this.indexPath, JSON.stringify([]) , {flag : 'wx'}) // write only if the file does not exists


        }
        catch(error)    
        {
            console.log("Already intialized");

        }
    }

    //create a hash git uses SHA-1 hash just use the module so easy 
    hashObject(content)
    {
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex'); // updates thehash content of the given data with utf -8 
        //.digest calculates the final value of the hash into a hexadecimal 
    }

    async add(fileToBeAdded)
    {
        const fileData = await fs.readFile(fileToBeAdded, {encoding : 'utf-8'});
        const fileHash = this.hashObject(fileData); // the hash string 

        //create a file inside the object folder and then create the file
        //the name of the file is the HASH 
        // in git the 38charters are the name og the file and the first two are actually the folder
        console.log(fileHash);
        const newFileHashedObejctFile = path.join(this.objectsPath, fileHash);
        await fs.writeFile(newFileHashedObejctFile, fileData);

        await this.updateStagingArea(fileToBeAdded, fileHash);
        console.log(`Added ${fileToBeAdded}`);

    
    }

    async updateStagingArea(filePath, fileHash)
    {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'}));
        index.push({path : filePath, hash : fileHash});
        await fs.writeFile(this.indexPath, JSON.stringify(index));
    }

    async commit(message)
    {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding : 'utf-8'}));
        const parentCommit = await this.getCurrentHead();

        const commitData = 
        {
            timeStamp: new Date().toISOString(),
            message, 
            files: index, 
            parent : parentCommit
        };

        const commitHash = this.hashObject(JSON.stringify(commitData));
        const commitPath = path.join(this.objectsPath, commitHash);
        await fs.writeFile(commitPath, JSON.stringify(commitData));
         
        //upadte the headpointer 
        await fs.writeFile(this.headPath, commitHash);
        await fs.writeFile(this.indexPath, JSON.stringify([]));

        console.log(`Commit sucefully create at ${commitHash}`);
        
    }

    async getCurrentHead()
    {
        try
        {
            return await fs.readFile(this.headPath, {encoding: 'utf-8'});    
        }
        catch (error)
          {
            return null;
        }
    }

    async log()
    {
        let currentCommitHash  = await this.getCurrentHead();
        while (currentCommitHash)
        {
            const commitData = JSON.parse(await fs.readFile(path.join(this.objectsPath,currentCommitHash), {encoding: 'utf-8'}));
            console.log(`Commit: ${currentCommitHash} \n Date :${commitData.timeStamp} \n ${commitData.message} \n------------------------\n\n`);

            currentCommitHash = commitData.parent;

        }
    }

    async showCommitDiff(commitHash)
    {
        const commitData = JSON.parse(await this.getCommitData(commitHash));
        if(!commitData)
        {
            console.log("Commit data not found");
            return;
        }
        console.log("Changes in the last commit are: ")

        for(const file of commitData.files)
        {
            console.log(`File is ${file.path}`);
            const fileContent = await this.getFileContent(file.hash);
            console.log(fileContent);

            if(commitData.parent)
            {
                //get parent commit data
                const parentCommitData = JSON.parse(await this.getCommitData(commitData.parent));
                const getParentFileContent = await this.getParentFileContent(parentCommitData, file.path);
                if(this.getParentFileContent !== undefined)
                {
                    console.log("Diff\n");
                    const diff = diffLines(getParentFileContent, fileContent);
                    diff.forEach(part =>  {
                        if(part.added)
                        {
                            process.stdout.write(chalk.green( "++" + part.value));
                        }
                        else if(part.removed)
                        {
                            process.stdout.write(chalk.red("--" + part.value));
                        }
                        else
                        {
                            process.stdout.write(chalk.gray(part.value));

                        }

                    });
                    console.log();
                } else 
                {
                    console.log("New file commited\n");
                }

            }
            else
            {
                console.log("No parent\n");
            }


        }

    }

    async getParentFileContent(parentCommitData, filePath)
    {
        const parentFile = parentCommitData.files.find(file => file.path === filePath );
        if (parentFile)
        {
            return await this.getFileContent(parentFile.hash);      
        }
    }

    async getCommitData(commitHash)
    {
        const commitPath = path.join(this.objectsPath, commitHash);

        try 
        {
            return await fs.readFile(commitPath, {encoding: 'utf-8'});

        }
        catch(error)
        {
            console.log("failed to read data" ,error);
            return null;
        }
    }
    async getFileContent(fileHash)
    {
        const objectsPath = path.join(this.objectsPath, fileHash);
        return fs.readFile(objectsPath, {encoding : 'utf-8'});

    }
}


// (async () => {
//     const NOGIT = new nogit();
//     await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure init completes

// //    await NOGIT.add("sample.txt");
// //    await NOGIT.commit('Initial commit');
//   //  await NOGIT.commit('second commit');
//     //await NOGIT.commit('second commit');

//     NOGIT.showCommitDiff('0ff449ef102bf2d0a6e17cb1dc6d07b158e840cf');
//     await NOGIT.log();

// })();


program.command('init').action(async () => 
    {
        const repo = new nogit();
    });
    
    program.command('add <file>').action(async (file) => 
    {
        const repo = new nogit();
        await repo.add(file);
    });
    
    program.command('commit <message>').action(async (message) => 
    {
        const repo = new nogit();
        await repo.commit(message);
    });
    
    program.command('show <commitHash>').action(async (commitHash) => 
    {
        const repo = new nogit();
        await repo.showCommitDiff(commitHash);
    });
    
    program.command('log').action(async () => 
    {
        const repo = new nogit();
        await repo.log();
    });
    
    program.parse(process.argv);
    
