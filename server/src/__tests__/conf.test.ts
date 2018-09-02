import getConfig from "../conf";

const startEnv = {...process.env};


afterEach(() => {
    process.env = {...startEnv}
})


describe('config tests', () => {
    it('pulls variables from the environment', () => {
        process.env = {
            NIOBE_PORT: '9999',
            NIOBE_HOST: 'localhost:443',
        }
        // @ts-ignore: optional value not retained as such in partial
        expect(getConfig().port).toEqual(9999)
        // @ts-ignore: optional value not retained as such in partial
        expect(getConfig().host).toEqual('localhost:443')
    })

    it('returns defaults for vars not in the env', () => {
        // @ts-ignore: optional value not retained as such in partial
        expect(getConfig().port).toEqual(8080)
        // @ts-ignore: optional value not retained as such in partial
        expect(getConfig().host).toEqual('127.0.0.1')
    })

    it('prioritizes passed in overrides over defaults', () => {
        expect(getConfig({'NIOBE_PORT': '9898'}).port).toEqual(9898)
    })

    it('prioritizes env vars over dotenv vars', () => {
        process.env = {'NIOBE_PORT': '9988'}
        expect(getConfig({'NIOBE_PORT': '9999'}).port).toEqual(9988)
    })

})
